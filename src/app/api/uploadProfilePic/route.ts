import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/db";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    const file = req.body.file; // Ensure you're sending the file correctly

    // Uploading file to Supabase
    const { data, error } = await supabase.storage.from("profilePics").upload(`public/${session.user.id}.png`, file);

    if (error) {
      return res.status(500).json({ message: "Failed to upload image", error });
    }

    // Get public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage.from("profilePics").getPublicUrl(`public/${session.user.id}.png`);

    if (!publicUrlData) {
      return res.status(500).json({ message: "Failed to get public URL" });
    }

    const publicUrl = publicUrlData.publicUrl;

    // Update user profile with new image URL
    await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: { profileImage: publicUrl },
    });

    return res.status(200).json({ message: "Profile picture updated successfully", url: publicUrl });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
