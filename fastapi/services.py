import requests
import random


class InterferenceRunnerService:
	# TODO: load from env
	ENDPOINT_ASK = "https://inference-runner.hw.ask-ai.co/ask/"
	API_KEYS = (
		"7c4e87e6-aef8-467a-b43a-4f80147453bf",
		"3211bc12-9ba4-4169-b8a3-dbc92494fa76",
		"e4f24b15-f271-4abd-8c8f-3ec106941bfa",
	)

	def _get_api_key(self):
		return random.choice(self.API_KEYS)

	def _ask(self, question) -> list:
		"""Send a POST request to the /ask endpoint.

		returns List of possible chunks that holds the answer.

		Notes:
			The chunks are not ordered by confidence
			The confidence is not static
		"""

		payload = {"question": question}

		response = requests.post(
			self.ENDPOINT_ASK,
			json=payload,
			headers={
				"X-API-Key": self._get_api_key()
			}
		)

		if response.status_code == 200:
			return response.json()['chunks']

		# TODO: Handle errors

	def ask_question(self, question: str, confidence_level: int | float =70) -> list:
		"""Return chunks for a question atleast a given confidence_level."""

		chunks = self._ask(question)
		valid_chunks = [
			chunk
			for chunk in chunks
			if chunk["confidence"] >= confidence_level
		]

		return valid_chunks