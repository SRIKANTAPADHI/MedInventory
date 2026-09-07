import { NextResponse } from "next/server";

export async function GET(request){
    const token = request.cookies.get("token")?.value;

    if(!token){
        return NextResponse.json(
        {loggeIn:false},
        {status:401}
        )
    }
    return NextResponse.json({
        loggedIn:true,
    })
}