import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post, { calculateReadTime } from '@/models/Post';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    // Find and atomically increment view count
    const post = await Post.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch post by slug error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to edit this post' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized: Session expired' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { title, content, excerpt, coverImage, tags } = await request.json();

    await connectToDatabase();

    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Authorization check: only author can edit
    if (post.author.toString() !== payload.id) {
      return NextResponse.json(
        { error: 'Forbidden: You are not authorized to edit this post' },
        { status: 403 }
      );
    }

    if (title) post.title = title;
    if (content) {
      post.content = content;
      post.readTime = calculateReadTime(content);
    }
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (Array.isArray(tags)) post.tags = tags;

    await post.save();

    return NextResponse.json(
      { message: 'Post updated successfully', post },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to delete this post' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized: Session expired' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    await connectToDatabase();

    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Authorization check: only author can delete
    if (post.author.toString() !== payload.id) {
      return NextResponse.json(
        { error: 'Forbidden: You are not authorized to delete this post' },
        { status: 403 }
      );
    }

    await Post.deleteOne({ _id: post._id });

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}
