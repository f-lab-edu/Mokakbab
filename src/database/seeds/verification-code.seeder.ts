import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { VerificationCodeEntity } from "@APP/entities/verification-code.entity";

export default class VerificationCodeSeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const verificationCodeFactory = factoryManager.get(
            VerificationCodeEntity,
        );

        await verificationCodeFactory.save();

        console.log(`인증코드 생성 완료`);
    }
}
