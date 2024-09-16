import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

//read
//url => api/v1/todo
export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Todo.find({});
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      error: err,
    });
  }
}

//create
//url => api/v1/todo
export async function POST(req: NextRequest){
  try{
  const body = await req.json();
  const res = await Todo.create(body);
  return NextResponse.json({ data: res });
  }catch(error){
    return NextResponse.json({
      error: error,
    });
  }
 }

//update
//url => api/v1/todo
export async function PUT(req: NextRequest) {
  try{
    const body = await req.json();
    const res = await Todo.updateOne(body);
    return NextResponse.json({ data: res });
    }catch(error){
      return NextResponse.json({
        error: error,
      });
    }
}

//delete
//url => api/v1/todo
export async function DELETE(req: NextRequest) {
  try{
    const body = await req.json();
    const res = await Todo.deleteOne(body);
    return NextResponse.json({ data: res });
    }catch(error){
      return NextResponse.json({
        error: error,
      });
    }
}