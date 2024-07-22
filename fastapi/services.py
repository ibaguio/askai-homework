import requests
import random


class InterferenceRunnerService:
	# TODO: load from env
	ENDPOINT_BASE = "https://inference-runner.hw.ask-ai.co"
	API_KEYS = (
		"7c4e87e6-aef8-467a-b43a-4f80147453bf",
		"3211bc12-9ba4-4169-b8a3-dbc92494fa76",
		"e4f24b15-f271-4abd-8c8f-3ec106941bfa",
	)

	def _get_credentials(self):
		return {
			"X-API-Key": random.choice(self.API_KEYS),
		}

	def _ask(self, question) -> list:
		"""Send a POST request to the /ask endpoint.

		returns List of possible chunks that holds the answer.

		Notes:
			The chunks are not ordered by confidence
			The confidence is not static
		"""

		payload = {"question": question}

		response = requests.post(
			f"{self.ENDPOINT_BASE}/ask/",
			json=payload,
			headers=self._get_credentials(),
		)

		if response.status_code == 200:
			return response.json()['chunks']

		# TODO: Handle errors

	def ask_question(self, question: str, confidence_level: int | float =70) -> list:
		"""Return chunks IDs for a question atleast a given confidence_level."""

		chunks = self._ask(question)
		valid_chunks = [
			chunk["chunkId"]
			for chunk in chunks
			if chunk["confidence"] >= confidence_level
		]

		return valid_chunks


class ChunkHolderService:
	ENDPOINT_BASE = "https://chunk-holder.hw.ask-ai.co/"
	API_KEYS = (
		"d486a94c-29f4-453a-a822-f909a97dbfa7",
		"aa156e6b-0f41-4ef7-ae7a-f9ff8b5b5ad3",
		"43ecda4c-7ee1-4acb-a50f-7f81e4c90719",
	)

	def _get_jwt_token(self) -> str:
		response = requests.post(
			f"{self.ENDPOINT_BASE}/auth/generate-token",
			headers={
				"X-API-Key": random.choice(self.API_KEYS),
			}
		)

		if response.status_code == 200:
			token = response.json()["token"]
			return token

		# TODO: handle errors

	def _get_credentials(self):
		headers = {
			"Authorization": self._get_jwt_token()
		}
		print(headers)
		return headers

	def get_chunk_content(self, chunk_id) -> str:
		# TODO: add validation that chunk_id is a uuid?
		assert isinstance(chunk_id, str)

		response = requests.get(
			f"{self.ENDPOINT_BASE}/chunks/{chunk_id}",
			headers=self._get_credentials()
		)

		if response.status_code == 200:
			return response.json()
