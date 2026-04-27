using HotChocolate.Types;
using Backend.Entities;
using Backend.GraphQL.Resolvers;

namespace Backend.GraphQL.Types;

public class NoteType : ObjectType<Note>
{
    protected override void Configure(IObjectTypeDescriptor<Note> descriptor)
    {
        descriptor.Field(x => x.Id).Type<NonNullType<IntType>>();
        descriptor.Field(x => x.AuthorId).Type<NonNullType<IntType>>();
        descriptor.Field(x => x.Title).Type<NonNullType<StringType>>();
        descriptor.Field(x => x.Content).Type<NonNullType<StringType>>();
        descriptor.Field(x => x.CreatedAt).Type<NonNullType<DateTimeType>>();
        descriptor.Field("tags").ResolveWith<NoteResolvers>(r => r.GetTagsForNoteAsync(default!, default!));
    }
}
