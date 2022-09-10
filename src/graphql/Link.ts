import { extendType, objectType, nonNull, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
    name: "Link", // 1
    definition(t) {  // 2
        t.nonNull.int("id"); // 3
        t.nonNull.string("description"); // 4
        t.nonNull.string("url"); // 5
        t.field("postedBy",{
            type: "User",
            resolve(parent, args, context){
                return context.prisma.link
                .findUnique({where: {id: parent.id}})
                .postedBy();
            }
        })
    },
});

export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            resolve(parent, args, context, info) {
                return context.prisma.link.findMany();
            }
        })
    }
})

export const LinkMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Link",
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },

            resolve(parent, args, context) {


                const link = context.prisma.link.create({
                    data: {
                        description: args.description,
                        url: args.url,
                    }
                });
                return link;
            },
        });
    },
});