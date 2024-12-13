import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setSeederFactory } from "typeorm-extension";

import { ENV_JWT_SECRET_KEY } from "@APP/common/constants/env-keys.const";
import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";

export default setSeederFactory(RefreshTokenEntity, async (faker) => {
    const payload = {
        email: faker.internet.email(),
        sub: faker.number.int(),
        type: "refresh",
    };

    const secret = process.env[ENV_JWT_SECRET_KEY] || "secret";
    const expiresIn = "3600";

    const refreshToken = new RefreshTokenEntity();

    const token = jwt.sign(payload, secret, { expiresIn });
    refreshToken.token = await bcrypt.hash(token, 10);

    return refreshToken;
});
