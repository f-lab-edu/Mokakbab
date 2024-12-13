import { setSeederFactory } from "typeorm-extension";

import { MemberEntity } from "../../entities/member.entity";

export default setSeederFactory(MemberEntity, async (faker) => {
    // bcrypt 로 해싱하면 너무 느려서 미리 해싱
    const hashedPassword =
        "$2b$10$2AzriinQGFUi0HE2LNReqeWopVZKYMKlAM9t0TjGRztoCdpSsnXva";

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const email = `user_${timestamp}_${randomString}@${faker.internet.domainName()}`;

    const member = new MemberEntity();
    member.name = faker.person.firstName();
    member.nickname = faker.person.lastName();
    member.email = email;
    member.password = hashedPassword;
    member.isEmailVerified = true;
    member.profileImage = Math.random() > 0.5 ? faker.image.avatar() : null;

    return member;
});
