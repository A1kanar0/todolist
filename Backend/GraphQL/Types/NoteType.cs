using HotChocolate.Types;
using Backend.Entities;
using Backend.Services;

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

        descriptor.Field("author")
            .Type<UserType>()
            .ResolveWith<NoteResolvers>(r => r.GetAuthorAsync(default!, default!))
            .Description("Користувач, який є автором цієї нотатки");
        descriptor.Field("images")
            .ResolveWith<NoteResolvers>(r => r.GetImagesAsync(default!, default!));
        
    }

    private class NoteResolvers
    {
        public async Task<User?> GetAuthorAsync(
            [Parent] Note note,
            [Service] IUserService userService)
        {
            return await userService.GetUserByIdAsync(note.AuthorId);
        }
        
        public async Task<IEnumerable<NoteImage>> GetImagesAsync([Parent] Note note, [Service] INoteImageService service)
        {
            return await service.GetImagesByNoteIdAsync(note.Id);
        }
    }
}
