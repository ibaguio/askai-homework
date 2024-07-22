VALID_QUESTIONS = (
    "How do I remove a teammate?",
    "What is the meaning of life?",
    "What should I eat for breakfast?",
)


from services import *
irs = InterferenceRunnerService()
q=VALID_QUESTIONS[0]

chunks = irs.ask_question(q)

chs = ChunkHolderService()

# for chk in chunks:
#   print(chs.get_chunk_content(chk["chunkId"]))


chunks_data = {
    chunk["chunkId"]: chunk["confidence"]
    for chunk in chunks
}

chunk_contents = chs.get_chunk_contents(chunks)

for uuid, content in chunk_contents.items():
    chunks_data[uuid] = uuid

from pprint import pprint
pprint(chunks_data)