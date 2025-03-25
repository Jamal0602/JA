"use server"

import { cookies } from "next/headers"
import { githubDB, COLLECTIONS } from "@/lib/db-config"
import { getCachedData } from "@/lib/github-db"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import * as bcrypt from "bcryptjs"

// Session management
export async function createSession(userId: string, isAdmin: boolean) {
  const sessionId = uuidv4()
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const sessions = (await getCachedData(githubDB, "sessions.json")) || {}
  sessions[sessionId] = { userId, isAdmin, expires: expires.toISOString() }

  await githubDB.saveFile("sessions.json", sessions)

  cookies().set("session_id", sessionId, {
    expires,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  return sessionId
}

export async function getSession() {
  const sessionId = cookies().get("session_id")?.value

  if (!sessionId) {
    return null
  }

  const sessions = (await getCachedData(githubDB, "sessions.json")) || {}
  const session = sessions[sessionId]

  if (!session) {
    return null
  }

  const expires = new Date(session.expires)

  if (expires < new Date()) {
    // Session expired
    await deleteSession(sessionId)
    return null
  }

  return session
}

export async function deleteSession(sessionId: string) {
  const sessions = (await getCachedData(githubDB, "sessions.json")) || {}
  delete sessions[sessionId]
  await githubDB.saveFile("sessions.json", sessions)
  cookies().delete("session_id")
}

// Authentication
export async function loginWithPassword(password: string) {
  const settings = (await getCachedData(githubDB, COLLECTIONS.SETTINGS)) || {}

  if (!settings.adminPassword) {
    // First time setup - create a hashed password
    const hashedPassword = await bcrypt.hash(password, 10)
    settings.adminPassword = hashedPassword
    await githubDB.saveFile(COLLECTIONS.SETTINGS, settings)
    await createSession("admin", true)
    return true
  }

  const isValid = await bcrypt.compare(password, settings.adminPassword)

  if (isValid) {
    await createSession("admin", true)
    return true
  }

  return false
}

export async function loginWithPin(pin: string) {
  const settings = (await getCachedData(githubDB, COLLECTIONS.SETTINGS)) || {}

  if (!settings.adminPin) {
    return false
  }

  if (pin === settings.adminPin) {
    await createSession("admin", true)
    return true
  }

  return false
}

export async function logout() {
  const sessionId = cookies().get("session_id")?.value

  if (sessionId) {
    await deleteSession(sessionId)
  }

  redirect("/")
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const settings = (await getCachedData(githubDB, COLLECTIONS.SETTINGS)) || {}

  if (!settings.adminPassword) {
    // First time setup
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    settings.adminPassword = hashedPassword
    await githubDB.saveFile(COLLECTIONS.SETTINGS, settings)
    return true
  }

  const isValid = await bcrypt.compare(currentPassword, settings.adminPassword)

  if (!isValid) {
    return false
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  settings.adminPassword = hashedPassword
  await githubDB.saveFile(COLLECTIONS.SETTINGS, settings)
  return true
}

export async function updatePin(pin: string) {
  const settings = (await getCachedData(githubDB, COLLECTIONS.SETTINGS)) || {}
  settings.adminPin = pin
  await githubDB.saveFile(COLLECTIONS.SETTINGS, settings)
  return true
}

export async function updateRecoveryEmails(emails: string[]) {
  const settings = (await getCachedData(githubDB, COLLECTIONS.SETTINGS)) || {}
  settings.recoveryEmails = emails
  await githubDB.saveFile(COLLECTIONS.SETTINGS, settings)
  return true
}

