"use server";

import { revalidatePath } from "next/cache";
import { getCollection, Collections, TeamDocument, UserDocument, ObjectId } from "@/lib/mongodb";

export interface InviteTeamMemberInput {
  email: string;
  role: "admin" | "editor" | "viewer";
  teamId?: string;
}

export async function inviteTeamMember(input: InviteTeamMemberInput) {
  try {
    const usersCollection = await getCollection<UserDocument>(Collections.USERS);
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: input.email });
    
    if (existingUser) {
      return {
        success: false,
        error: "User already exists in the system",
      };
    }

    // Create pending user
    const userDoc: Omit<UserDocument, "_id"> = {
      email: input.email,
      name: input.email.split("@")[0], // Temporary name
      role: input.role,
      teamId: input.teamId ? new ObjectId(input.teamId) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: "system",
        defaultTone: "professional",
        defaultContentType: "blog",
      },
    };

    await usersCollection.insertOne(userDoc as UserDocument);
    
    // In production, send invitation email here
    
    revalidatePath("/dashboard/team");
    
    return { success: true };
  } catch (error) {
    console.error("Invite team member error:", error);
    return {
      success: false,
      error: "Failed to invite team member",
    };
  }
}

export async function updateTeamMemberRole(
  userId: string,
  newRole: "admin" | "editor" | "viewer"
) {
  try {
    const usersCollection = await getCollection<UserDocument>(Collections.USERS);
    
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          role: newRole,
          updatedAt: new Date(),
        },
      }
    );
    
    revalidatePath("/dashboard/team");
    
    return { success: true };
  } catch (error) {
    console.error("Update team member role error:", error);
    return {
      success: false,
      error: "Failed to update role",
    };
  }
}

export async function removeTeamMember(userId: string) {
  try {
    const usersCollection = await getCollection<UserDocument>(Collections.USERS);
    
    await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    
    revalidatePath("/dashboard/team");
    
    return { success: true };
  } catch (error) {
    console.error("Remove team member error:", error);
    return {
      success: false,
      error: "Failed to remove team member",
    };
  }
}

export async function createTeam(name: string) {
  try {
    const teamsCollection = await getCollection<TeamDocument>(Collections.TEAMS);
    
    const teamDoc: Omit<TeamDocument, "_id"> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      ownerId: new ObjectId(), // In production, get from auth session
      members: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await teamsCollection.insertOne(teamDoc as TeamDocument);
    
    return {
      success: true,
      id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("Create team error:", error);
    return {
      success: false,
      error: "Failed to create team",
    };
  }
}

