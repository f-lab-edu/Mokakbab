import { setSeederFactory } from "typeorm-extension";

import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";

export default setSeederFactory(RefreshTokenEntity, async () => {
    const refreshToken = new RefreshTokenEntity();

    // bcrypt 해시가 너무 오래 걸려 미리 해싱
    refreshToken.token =
        "$2b$10$ndYzoPCCXt.24qzOusAB/OYMqaS1UKVqQsGvQh9t/MaqFqgg.g0fO";

    return refreshToken;
});
