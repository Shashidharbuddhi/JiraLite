import User, { USER_ROLES } from '../models/User.js';

export const DEFAULT_PLATFORM_ADMIN = {
  name: 'Platform Admin',
  email: 'admin@jiralite.app',
  password: 'Admin@123456'
};

const seedPlatformAdmin = async () => {
  const adminEmail = (process.env.PLATFORM_ADMIN_EMAIL || DEFAULT_PLATFORM_ADMIN.email).trim().toLowerCase();
  const adminPassword = process.env.PLATFORM_ADMIN_PASSWORD || DEFAULT_PLATFORM_ADMIN.password;
  const adminName = process.env.PLATFORM_ADMIN_NAME || DEFAULT_PLATFORM_ADMIN.name;

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    let shouldSave = false;

    if (existingAdmin.role !== USER_ROLES.PLATFORM_ADMIN) {
      existingAdmin.role = USER_ROLES.PLATFORM_ADMIN;
      existingAdmin.workspaceId = null;
      existingAdmin.isSuspended = false;
      existingAdmin.emailVerified = true;
      shouldSave = true;
    }

    const passwordMatches = await existingAdmin.matchPassword(adminPassword);

    if (!passwordMatches) {
      existingAdmin.password = adminPassword;
      shouldSave = true;
    }

    if (existingAdmin.name !== adminName) {
      existingAdmin.name = adminName;
      shouldSave = true;
    }

    if (!existingAdmin.emailVerified) {
      existingAdmin.emailVerified = true;
      shouldSave = true;
    }

    if (shouldSave) {
      await existingAdmin.save();
    }

    console.log(`Platform admin ready: ${adminEmail}`);
    return;
  }

  await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: USER_ROLES.PLATFORM_ADMIN,
    workspaceId: null,
    emailVerified: true
  });

  console.log(`Platform admin ready: ${adminEmail}`);
};

export default seedPlatformAdmin;
