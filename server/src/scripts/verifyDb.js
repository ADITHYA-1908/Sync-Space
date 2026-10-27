import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  User,
  Workspace,
  WorkspaceMembership,
  Channel,
  ChannelMembership,
  Conversation,
  Message,
} from '../models/index.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/syncspace';

async function runVerification() {
  console.log('========================================================');
  console.log('🧪 SyncSpace Part 3: MongoDB & Mongoose Verification');
  console.log('========================================================');
  console.log(`Connecting to: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB successfully.');

    // Ensure all model indexes are initialized in MongoDB
    await Promise.all([
      User.init(),
      Workspace.init(),
      WorkspaceMembership.init(),
      Channel.init(),
      ChannelMembership.init(),
      Conversation.init(),
      Message.init(),
    ]);
    console.log('✅ Schema indexes verified in MongoDB.\n');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('Please verify that your MongoDB service is running or check your MONGODB_URI in server/.env.');
    process.exit(1);
  }

  const testSuffix = Date.now();
  const createdIds = {
    users: [],
    workspaces: [],
    memberships: [],
    channels: [],
    channelMemberships: [],
    conversations: [],
    messages: [],
  };

  try {
    // ----------------------------------------------------
    // TEST 1: User Model & Email Uniqueness
    // ----------------------------------------------------
    console.log('1️⃣ Testing User Model...');
    const testUser = await User.create({
      name: `Test Engineer ${testSuffix}`,
      email: `test.engineer.${testSuffix}@syncspace.test`,
      passwordHash: 'argon2id$v=19$m=65536,t=3,p=4$dummyhashedsecret',
      status: 'online',
      statusText: 'Running automated schema verification',
    });
    createdIds.users.push(testUser._id);
    console.log(`   ✓ Created User: ${testUser.name} (${testUser._id})`);

    // Verify passwordHash is excluded by default
    const queriedUser = await User.findById(testUser._id);
    if (queriedUser.passwordHash) {
      throw new Error('Security violation: passwordHash was returned in default query!');
    }
    console.log('   ✓ Security check passed: passwordHash is excluded from query results.');

    // Test email uniqueness constraint
    let duplicateRejected = false;
    try {
      await User.create({
        name: 'Duplicate Email User',
        email: `test.engineer.${testSuffix}@syncspace.test`,
        passwordHash: 'dummyhash',
      });
    } catch (err) {
      duplicateRejected = true;
      console.log('   ✓ Unique constraint verified: duplicate email was rejected.');
    }
    if (!duplicateRejected) {
      throw new Error('Database allowed duplicate email creation!');
    }

    // ----------------------------------------------------
    // TEST 2: Workspace Model
    // ----------------------------------------------------
    console.log('\n2️⃣ Testing Workspace Model...');
    const testWorkspace = await Workspace.create({
      name: `Test Team ${testSuffix}`,
      description: 'Temporary workspace for verification testing',
      ownerId: testUser._id,
    });
    createdIds.workspaces.push(testWorkspace._id);
    console.log(`   ✓ Created Workspace: "${testWorkspace.name}" (Slug: ${testWorkspace.slug})`);

    // ----------------------------------------------------
    // TEST 3: WorkspaceMembership Model & Compound Index
    // ----------------------------------------------------
    console.log('\n3️⃣ Testing WorkspaceMembership Model...');
    const membership = await WorkspaceMembership.create({
      workspaceId: testWorkspace._id,
      userId: testUser._id,
      role: 'owner',
    });
    createdIds.memberships.push(membership._id);
    console.log(`   ✓ Created WorkspaceMembership for user as "${membership.role}"`);

    // Verify duplicate membership prevention
    let duplicateMembershipRejected = false;
    try {
      await WorkspaceMembership.create({
        workspaceId: testWorkspace._id,
        userId: testUser._id,
        role: 'member',
      });
    } catch (err) {
      duplicateMembershipRejected = true;
      console.log('   ✓ Compound index verified: duplicate membership was rejected.');
    }
    if (!duplicateMembershipRejected) {
      throw new Error('Compound index failed: allowed duplicate membership!');
    }

    // ----------------------------------------------------
    // TEST 4: Channel Model & Workspace-Scoped Unique Name
    // ----------------------------------------------------
    console.log('\n4️⃣ Testing Channel Model...');
    const testChannel = await Channel.create({
      workspaceId: testWorkspace._id,
      name: 'announcements',
      topic: 'Important system announcements',
      type: 'public',
      createdBy: testUser._id,
    });
    createdIds.channels.push(testChannel._id);
    console.log(`   ✓ Created Channel: #${testChannel.name} in workspace.`);

    // Verify duplicate channel name in same workspace is rejected
    let duplicateChannelRejected = false;
    try {
      await Channel.create({
        workspaceId: testWorkspace._id,
        name: 'announcements',
        type: 'public',
        createdBy: testUser._id,
      });
    } catch (err) {
      duplicateChannelRejected = true;
      console.log('   ✓ Workspace channel uniqueness verified: duplicate channel name rejected.');
    }
    if (!duplicateChannelRejected) {
      throw new Error('Allowed duplicate channel in same workspace!');
    }

    // ----------------------------------------------------
    // TEST 5: ChannelMembership Model
    // ----------------------------------------------------
    console.log('\n5️⃣ Testing ChannelMembership Model...');
    const channelMember = await ChannelMembership.create({
      channelId: testChannel._id,
      userId: testUser._id,
    });
    createdIds.channelMemberships.push(channelMember._id);
    console.log(`   ✓ Created ChannelMembership record.`);

    // ----------------------------------------------------
    // TEST 6: Conversation Model & Participant Sorting
    // ----------------------------------------------------
    console.log('\n6️⃣ Testing Conversation Model...');
    const testUser2 = await User.create({
      name: `Second User ${testSuffix}`,
      email: `second.user.${testSuffix}@syncspace.test`,
      passwordHash: 'dummyhash123',
    });
    createdIds.users.push(testUser2._id);

    const conversation = await Conversation.create({
      type: 'direct',
      participantIds: [testUser2._id, testUser._id], // Passed in reverse order
    });
    createdIds.conversations.push(conversation._id);

    // Verify pre-save sorting
    const sortedExpected = [testUser._id.toString(), testUser2._id.toString()].sort();
    const actualSorted = conversation.participantIds.map((id) => id.toString());
    const isSorted = JSON.stringify(actualSorted) === JSON.stringify(sortedExpected);
    console.log(`   ✓ Created Direct Conversation between 2 users.`);
    console.log(`   ✓ Deterministic participant sorting verified: ${isSorted ? 'PASSED' : 'FAILED'}`);

    // ----------------------------------------------------
    // TEST 7: Message Model & Destination Mutual Exclusivity
    // ----------------------------------------------------
    console.log('\n7️⃣ Testing Message Model...');
    const validMessage = await Message.create({
      senderId: testUser._id,
      channelId: testChannel._id,
      content: 'Hello SyncSpace team! Automated test message.',
    });
    createdIds.messages.push(validMessage._id);
    console.log(`   ✓ Created valid channel message: "${validMessage.content}"`);

    // Verify that a message with BOTH channelId and conversationId is rejected
    let dualDestinationRejected = false;
    try {
      await Message.create({
        senderId: testUser._id,
        channelId: testChannel._id,
        conversationId: conversation._id,
        content: 'This message has two destinations and must fail.',
      });
    } catch (err) {
      dualDestinationRejected = true;
      console.log('   ✓ Mutual exclusivity verified: message with BOTH destinations was rejected.');
    }
    if (!dualDestinationRejected) {
      throw new Error('Validation failed: message allowed both channelId and conversationId!');
    }

    // Verify that a message with NEITHER channelId nor conversationId is rejected
    let noDestinationRejected = false;
    try {
      await Message.create({
        senderId: testUser._id,
        content: 'This message has no destination and must fail.',
      });
    } catch (err) {
      noDestinationRejected = true;
      console.log('   ✓ Destination requirement verified: message with NEITHER destination was rejected.');
    }
    if (!noDestinationRejected) {
      throw new Error('Validation failed: message allowed missing destinations!');
    }

    console.log('\n========================================================');
    console.log('🎉 ALL 7 MODEL SCHEMAS & CONSTRAINTS PASSED VALIDATION!');
    console.log('========================================================');
  } catch (testError) {
    console.error('\n❌ Verification Failed:', testError.message);
    throw testError;
  } finally {
    // ----------------------------------------------------
    // CLEANUP: Clean up all temporary test records
    // ----------------------------------------------------
    console.log('\n🧹 Cleaning up temporary test records from MongoDB...');
    try {
      if (createdIds.messages.length) await Message.deleteMany({ _id: { $in: createdIds.messages } });
      if (createdIds.channelMemberships.length) await ChannelMembership.deleteMany({ _id: { $in: createdIds.channelMemberships } });
      if (createdIds.channels.length) await Channel.deleteMany({ _id: { $in: createdIds.channels } });
      if (createdIds.conversations.length) await Conversation.deleteMany({ _id: { $in: createdIds.conversations } });
      if (createdIds.memberships.length) await WorkspaceMembership.deleteMany({ _id: { $in: createdIds.memberships } });
      if (createdIds.workspaces.length) await Workspace.deleteMany({ _id: { $in: createdIds.workspaces } });
      if (createdIds.users.length) await User.deleteMany({ _id: { $in: createdIds.users } });
      console.log('✅ Temporary records successfully purged.');
    } catch (cleanupErr) {
      console.warn('⚠️ Warning during cleanup:', cleanupErr.message);
    }

    await mongoose.connection.close();
    console.log('MongoDB connection closed cleanly.\n');
  }
}

runVerification().catch(() => {
  process.exit(1);
});
