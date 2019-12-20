# Note API Documentation
The Note API provides information about all the notes stored in the server and to be able to add new notes, retrieve and delete old notes.

## Get all notes
**Request Format:** /notes/all

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Return a list of all notes available

**Example Request:** /notes/all

**Example Response:**
```json
[
  {
    "id": 1,
    "title": "Hello World",
    "content": "Why Hello World?"
  },
  {
    "id": 2,
    "title": "Lorem Ipsum passage",
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
]
```

**Error Handling:**
N/A

## Get information of the selected note
**Request Format:** /notes/:id

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Given a valid note id, it returns a JSON of the basic note information. A valid note id can only be integer.

**Example Request:** /notes/2

**Example Response:**
```json
{
  "id": 2,
  "title": "Lorem Ipsum passage",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
}
```

**Error Handling:**
- Possible 400 errors (invalid request):
  - If passed in an invalid note id, an error is returned with: `{"Error": "Fail to find the requested note."}`
  - If the note with the id passed cannot be found, an error is returned with: `{"Error": "No note with id = " + id}`

## Add a note
**Request Format:** /add-note endpoint with form data (`id`, `title`, `content`)

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Given a note id, title and content, the new note is added to the server. While note id and title is mandatory, note content is optional.

**Example Request:** /add-note endpoint with form data `{id: 1, title: "Hello World", content: "Why Hello World?"}`

**Example Response:**
```
Successfully add the note.
```

**Error Handling:**
N/A

## Delete a note
**Request Format:** /remove-note endpoint with form data (`id`)

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Given a note id, it searches for the note and deletes it from the server.

**Example Request:** /remove-note endpoint with form data `{id: 1}`

**Example Response:**
```
Successfully remove the selected note.
```

**Error Handling:**
- Possible 400 errors (invalid request):
  - If passed in an invalid note id, an error is returned with: `Error: Fail to remove the selected note.`
  - If the note with the id passed cannot be found, an error is returned with: `Error: No note with id = id`
