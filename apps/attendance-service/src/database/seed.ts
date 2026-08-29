import AppDataSource from './data-source';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { Attendance } from '../attendance/attendance.entity';
import { UserRole } from '../user/user.constant';

async function runSeed() {
  await AppDataSource.initialize();
  console.log('Database connected for seeding...');

  const userRepo = AppDataSource.getRepository(User);
  const attendanceRepo = AppDataSource.getRepository(Attendance);

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Seed Admin
  let admin = await userRepo.findOne({ where: { email: 'admin@mail.com' } });
  if (!admin) {
    admin = userRepo.create({
      email: 'admin@mail.com',
      password: defaultPassword,
      name: 'Super Admin',
      role: UserRole.ADMIN,
      position: 'Administrator',
      phone: '+628111111111',
    });
    admin = await userRepo.save(admin);
    console.log('Admin created: admin@mail.com');
  }

  // 2. Seed User 1 (Attendance 30 Juli 2026 - 25 Agustus 2026)
  let user1 = await userRepo.findOne({ where: { email: 'user1@mail.com' } });
  if (!user1) {
    user1 = userRepo.create({
      email: 'user1@mail.com',
      password: defaultPassword,
      name: 'Budi Santoso',
      role: UserRole.USER,
      position: 'Software Engineer',
      phone: '+628222222222',
    });
    user1 = await userRepo.save(user1);
    console.log('User 1 created: user1@mail.com');

    const startDate = new Date('2026-07-30');
    const endDate = new Date('2026-08-25');
    const recordsUser1 = [];

    const curr = new Date(startDate);
    while (curr <= endDate) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, '0');
      const day = String(curr.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const clockIn = new Date(`${dateStr}T08:00:00+07:00`);
      const clockOut = new Date(`${dateStr}T17:00:00+07:00`);

      recordsUser1.push(
        attendanceRepo.create({
          userId: user1.id,
          date: dateStr,
          clockIn,
          clockOut,
        }),
      );

      curr.setDate(curr.getDate() + 1);
    }

    await attendanceRepo.save(recordsUser1);
    console.log(`Seeded ${recordsUser1.length} attendance records for User 1`);
  }

  // 3. Seed User 2 (Attendance 26 Agustus 2026)
  let user2 = await userRepo.findOne({ where: { email: 'user2@mail.com' } });
  if (!user2) {
    user2 = userRepo.create({
      email: 'user2@mail.com',
      password: defaultPassword,
      name: 'Siti Rahma',
      role: UserRole.USER,
      position: 'UI/UX Designer',
      phone: '+628333333333',
    });
    user2 = await userRepo.save(user2);
    console.log('User 2 created: user2@mail.com');

    const dateStr = '2026-08-26';
    const clockIn = new Date(`${dateStr}T08:15:00+07:00`);
    const clockOut = new Date(`${dateStr}T17:05:00+07:00`);

    const recordUser2 = attendanceRepo.create({
      userId: user2.id,
      date: dateStr,
      clockIn,
      clockOut,
    });

    await attendanceRepo.save(recordUser2);
    console.log('Seeded 1 attendance record for User 2');
  }

  await AppDataSource.destroy();
  console.log('Seeding process finished.');
}

runSeed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});