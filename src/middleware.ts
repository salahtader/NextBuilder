import { clerkMiddleware, createRouteMatcher ,getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from "next";

const isPublicRoute = createRouteMatcher(['/site', '/api/uploadthing', '/agency/sign-in(.*)', '/agency/sign-up(.*)']);
export  async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    console.log('page2');
    
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Add logic that retrieves the data for the API route

  return res.status(200).json({ userId: userId });
}

export default clerkMiddleware((auth, req,res) => {
  const url = req.nextUrl
  console.log(url);
  
  if (!isPublicRoute(req)) {
    auth().protect();
  }
  else{
    console.log(req,res);
    
  handler(req,res);
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
