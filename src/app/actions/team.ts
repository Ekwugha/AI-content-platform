"use server";

import { revalidatePath } from "next/cache";
import { getCollection, Collections, TeamDocument, UserDocument, ObjectId, isMongoConfigured } from "@/lib/mongodb";

export interface InviteTeamMemberInput {
  email: string;
  role: "admin" | "editor" | "viewer";
  teamId?: string;
}

export async function inviteTeamMember(input: InviteTeamMemberInput) {
  if (!isMongoConfigured()) {
    console.log("👥 Mock: Inviting team member -", input.email);
    return { success: true, message: "Mock invite - Database not configured" };
  }

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
      name: input.email.split("@")[0],
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
  if (!isMongoConfigured()) {
    console.log("👥 Mock: Updating team member role -", userId, newRole);
    return { success: true, message: "Mock update" };
  }

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
  if (!isMongoConfigured()) {
    console.log("👥 Mock: Removing team member -", userId);
    return { success: true, message: "Mock remove" };
  }

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
  if (!isMongoConfigured()) {
    console.log("👥 Mock: Creating team -", name);
    return { success: true, id: "mock-" + Date.now(), message: "Mock create" };
  }

  try {
    const teamsCollection = await getCollection<TeamDocument>(Collections.TEAMS);
    
    const teamDoc: Omit<TeamDocument, "_id"> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      ownerId: new ObjectId(),
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
