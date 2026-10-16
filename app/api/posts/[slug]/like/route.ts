import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const post = await Post.findOneAndUpdate(
      { slug },
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Liked successfully', likes: post.likes },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to like post' },
      { status: 500 }
    );
  }
}
