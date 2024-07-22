from fastapi import FastAPI
from services import InterferenceRunnerService
from services import ChunkHolderService

app = FastAPI()

irs = InterferenceRunnerService()
chs = ChunkHolderService()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/ask")
async def ask(q: str):
    # Note: hardcoded for easier testing
    # TODO: remove this

    q = "How do I remove a teammate?"
    chunks = irs.ask_question(q)
    chunk_contents = chs.get_chunk_contents(chunks)

    chunks_data = {
        chunk["chunkId"]: chunk["confidence"]
        for chunk in chunks
    }

    # merge content and confidence level
    for uuid, content in chunk_contents.items():
        chunks_data[uuid] = content

    return chunks_data
