import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comments = await Comment.find({ postId: post._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch comments error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { authorName, content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check optional auth
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);
    const userPayload = token ? verifyToken(token) : null;

    const finalAuthorName = userPayload
      ? userPayload.name
      : (authorName && authorName.trim()) || 'Curious Reader';

    const comment = await Comment.create({
      postId: post._id,
      authorId: userPayload ? userPayload.id : undefined,
      authorName: finalAuthorName,
      content: content.trim(),
    });

    return NextResponse.json(
      { message: 'Comment added successfully', comment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add comment' },
      { status: 500 }
    );
  }
}
