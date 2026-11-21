export default defineEventHandler(async (event) => readBoards(await currentUserId(event)))
