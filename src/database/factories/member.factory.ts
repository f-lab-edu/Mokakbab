import * as bcrypt from "bcrypt";
import { setSeederFactory } from "typeorm-extension";

import { MemberEntity } from "../../entities/member.entity";

export default setSeederFactory(MemberEntity, async (faker) => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const member = new MemberEntity();
    member.name = faker.person.firstName();
    member.nickname = faker.person.lastName();
    member.email = faker.internet.email();
    member.password = hashedPassword;
    member.isEmailVerified = true;
    member.profileImage = Math.random() > 0.5 ? faker.image.avatar() : null;

    return member;
});
