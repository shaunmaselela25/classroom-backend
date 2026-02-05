import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from './db/index.js';
import { user } from './db/schema/auth.js';

async function main() {
  try {
    console.log('Performing CRUD operations...');

    // CREATE: Insert a new user
    const newUserId = randomUUID();
    const [newUser] = await db
      .insert(user)
      .values({
        id: newUserId,
        name: 'Admin User',
        email: `admin+${newUserId}@example.com`,
        emailVerified: false,
      })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    console.log('CREATE: New user created:', newUser);

    // READ: Select the user
    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.id, newUserId));
    console.log('READ: Found user:', foundUser[0]);

    // UPDATE: Change the user's name
    const [updatedUser] = await db
      .update(user)
      .set({ name: 'Super Admin' })
      .where(eq(user.id, newUserId))
      .returning();

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    console.log('UPDATE: User updated:', updatedUser);

    // DELETE: Remove the user
    await db.delete(user).where(eq(user.id, newUserId));
    console.log('DELETE: User deleted.');

    console.log('CRUD operations completed successfully.');
  } catch (error) {
    console.error('Error performing CRUD operations:', error);
    process.exit(1);
  }
}

main();
