import User, { USER_ROLES } from '../models/User.js';

const seedPlatformAdmin = async () => {
  const adminEmail = process.env.PLATFORM_ADMIN_EMAIL || 'admin@jiralite.local';
  const adminPassword = process.env.PLATFORM_ADMIN_PASSWORD || 'Admin@123456';
  const adminName = process.env.PLATFORM_ADMIN_NAME || 'Platform Admin';

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    let shouldSave = false;

    if (existingAdmin.role !== USER_ROLES.PLATFORM_ADMIN) {
      existingAdmin.role = USER_ROLES.PLATFORM_ADMIN;
      existingAdmin.workspaceId = null;
      existingAdmin.isSuspended = false;
      shouldSave = true;
    }

    const passwordMatches = await existingAdmin.matchPassword(adminPassword);

    if (!passwordMatches) {
      existingAdmin.password = adminPassword;
      shouldSave = true;
    }

    if (shouldSave) {
      await existingAdmin.save();
    }

    return;
  }

  await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: USER_ROLES.PLATFORM_ADMIN,
    workspaceId: null
  });
};

export default seedPlatformAdmin;
