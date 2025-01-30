import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as bcrypt from "bcrypt";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { CreateBlackListDto } from "@APP/dtos/create-black-list.dto";
import { UpdateMemberDto } from "@APP/dtos/update-member.dto";
import { MembersService } from "@APP/services/members.service";

@Controller("members")
export class MembersController {
    constructor(private readonly membersService: MembersService) {}

    @Get("blacks")
    getBlacks(@CurrentMemberDecorator("id") currentMemberId: number) {
        return this.membersService.findBlacks(currentMemberId);
    }

    @Post("blacks")
    postBlack(
        @CurrentMemberDecorator("id") currentMemberId: number,
        @Body() dto: CreateBlackListDto,
    ) {
        return this.membersService.createBlack(currentMemberId, dto.blackedId);
    }

    @Delete("blacks/:blackedId")
    deleteBlack(
        @CurrentMemberDecorator("id") currentMemberId: number,
        @Param("blackedId", new ParseIntPipe()) blackedId: number,
    ) {
        return this.membersService.deleteBlack(currentMemberId, blackedId);
    }

    @Get(":memberId")
    getMember(@Param("memberId", new ParseIntPipe()) memberId: number) {
        return this.membersService.findById(memberId);
    }

    @Delete(":memberId")
    async deleteMember(
        @CurrentMemberDecorator("id") currentMemberId: number,
        @Param("memberId", new ParseIntPipe()) memberId: number,
    ) {
        const member = await this.membersService.findById(memberId);

        if (!member) {
            throw new NotFoundException("존재하지 않는 회원입니다.");
        }

        if (currentMemberId !== memberId) {
            throw new ForbiddenException("권한이 없습니다.");
        }

        await this.membersService.deleteById(memberId);
    }

    @Patch(":memberId")
    async patchMember(
        @CurrentMemberDecorator("id") currentMemberId: number,
        @Param("memberId", new ParseIntPipe()) memberId: number,
        @Body() dto: UpdateMemberDto,
    ) {
        const member = await this.membersService.findById(memberId);

        if (!member) {
            throw new NotFoundException("존재하지 않는 회원입니다.");
        }

        if (currentMemberId !== memberId) {
            throw new ForbiddenException("권한이 없습니다.");
        }

        if (dto.password) {
            const hashedPassword = await bcrypt.hash(dto.password, 10);
            dto.password = hashedPassword;
        }

        await this.membersService.updateById(memberId, dto);

        return this.membersService.findById(memberId);
    }

    @Patch(":memberId/profile-image")
    @UseInterceptors(FileInterceptor("image"))
    async patchProfileImage(
        @CurrentMemberDecorator("id") currentMemberId: number,
        @UploadedFile()
        file: Express.Multer.File & { key: string; location: string },
    ) {
        const filename = file.key.split("/").at(-1) || "";
        await this.membersService.updateProfileImage(currentMemberId, filename);

        return {
            filename,
            location: file.location,
        };
    }
}
