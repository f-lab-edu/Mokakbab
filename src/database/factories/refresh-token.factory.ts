import * as bcrypt from "bcrypt";
import { setSeederFactory } from "typeorm-extension";

import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";

export default setSeederFactory(RefreshTokenEntity, async (faker) => {
    const refreshToken = new RefreshTokenEntity();

    const fakeToken = faker.string.alphanumeric(32);
    refreshToken.token = await bcrypt.hash(fakeToken, 10);

    return refreshToken;
});
