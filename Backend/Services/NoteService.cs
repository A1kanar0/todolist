using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.Repositories;
using Backend.Services;

namespace Backend.Services;

public class NoteService : INoteService
{
    private readonly INoteRepository _noteRepository;
    private readonly INoteImageService _noteImageService;

    public NoteService(INoteRepository noteRepository, INoteImageService noteImageService)
    {
        _noteRepository = noteRepository;
        _noteImageService = noteImageService;
    }

    public async Task<IEnumerable<Note>> GetAllNotesAsync() =>
        await _noteRepository.GetAllAsync();
    
    public async Task<Note?> GetNoteByIdAsync(int id)
    {
        if (id <= 0) 
            throw new ArgumentException("Invalid Note ID");

        return await _noteRepository.GetByIdAsync(id);
    }
    
    public async Task<Note> CreateNoteAsync(Note note)
    {
        if (note == null) throw new ArgumentNullException(nameof(note));
        
        if (note.AuthorId <= 0) 
            throw new ArgumentException("AuthorId is required and must be greater than zero");
            
        if (string.IsNullOrWhiteSpace(note.Title)) 
            throw new ArgumentException("Title is required");
            
        if (string.IsNullOrWhiteSpace(note.Content)) 
            throw new ArgumentException("Content is required");

        note.CreatedAt = DateTime.UtcNow;

        return await _noteRepository.CreateAsync(note);
    }

    public async Task<Note> UpdateNoteAsync(Note noteUpdates)
    {
        if (noteUpdates == null || noteUpdates.Id <= 0)
            throw new ArgumentException("Invalid Note ID");

        if (noteUpdates.AuthorId <= 0) 
            throw new ArgumentException("AuthorId is required and must be greater than zero");

        if (string.IsNullOrWhiteSpace(noteUpdates.Title))
            throw new ArgumentException("Title cannot be empty");

        if (string.IsNullOrWhiteSpace(noteUpdates.Content))
            throw new ArgumentException("Content cannot be empty");

        return await _noteRepository.UpdateAsync(noteUpdates);
    }

    public async Task<bool> DeleteNoteAsync(int noteId)
    {
        var images = await _noteImageService.GetImagesByNoteIdAsync(noteId);
        
        var success = await _noteRepository.DeleteAsync(noteId);
        
        if (success)
        {
            _noteImageService.DeleteFiles(images);
        }

        return success;
    }
}
