import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post, { generateSlug, calculateReadTime } from '@/models/Post';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    const query: any = {};

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch posts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to publish a post' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized: Session expired, please log in again' },
        { status: 401 }
      );
    }

    const { title, content, excerpt, coverImage, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const slug = generateSlug(title);
    const readTime = calculateReadTime(content);

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 160).trim() + '...',
      coverImage: coverImage || '',
      tags: Array.isArray(tags) ? tags : [],
      author: payload.id,
      authorName: payload.name,
      readTime,
    });

    return NextResponse.json(
      { message: 'Post created successfully', post },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}
