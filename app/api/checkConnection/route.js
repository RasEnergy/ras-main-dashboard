import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function GET() {
  try {
    const { stdout, stderr } = await execPromise("curl -Is --connect-timeout 5 http://10.180.70.177:30002");

    if (stderr) {
      return NextResponse.json({ 
        message: "Curl request failed", 
        error: stderr 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Curl connection successful", 
      output: stdout.trim() 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      message: "Curl execution error", 
      error: error.message 
    }, { status: 500 });
  }
}
