import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";

import { ArticleEntity } from "./article.entity";
import { MemberEntity } from "./member.entity";

@Unique(["articleId", "memberId"])
@Entity("article_likes")
export class ArticleLikeEntity {
    @PrimaryColumn({ type: "int" })
    articleId!: number;

    @ManyToOne(() => ArticleEntity, (article) => article.articleLikes)
    @JoinColumn({ name: "articleId", referencedColumnName: "id" })
    article!: ArticleEntity;

    @PrimaryColumn({ type: "int" })
    memberId!: number;

    @ManyToOne(() => MemberEntity, (member) => member.articleLikes)
    @JoinColumn({ name: "memberId", referencedColumnName: "id" })
    member!: MemberEntity;
}
