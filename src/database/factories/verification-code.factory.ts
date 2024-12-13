import * as crypto from "crypto";
import { setSeederFactory } from "typeorm-extension";

import { VerificationCodeEntity } from "@APP/entities/verification-code.entity";

export default setSeederFactory(VerificationCodeEntity, () => {
    const verificationCode = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    const verificationCodeEntity = new VerificationCodeEntity();
    verificationCodeEntity.code = verificationCode;

    return verificationCodeEntity;
});
