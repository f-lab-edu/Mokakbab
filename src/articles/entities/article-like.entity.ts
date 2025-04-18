import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { MemberEntity } from "@APP/members/entities/member.entity";

import { ArticleEntity } from "./article.entity";

@Entity("article_likes")
export class ArticleLikeEntity {
    @PrimaryColumn({
        type: "int",
    })
    memberId!: number;

    @PrimaryColumn({ type: "int" })
    articleId!: number;

    @ManyToOne(() => MemberEntity, (member) => member.articleLikes)
    @JoinColumn({ name: "memberId", referencedColumnName: "id" })
    member!: MemberEntity;

    @ManyToOne(() => ArticleEntity, (article) => article.articleLikes)
    @JoinColumn({ name: "articleId", referencedColumnName: "id" })
    article!: ArticleEntity;
}
