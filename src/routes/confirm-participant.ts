import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function confirmParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId/confirm',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
          participantId: z.string().uuid()

        })
      }
    }, async (request, replay) => {

    const { participantId } = request.params

    const participant = await prisma.participant.findUnique({
      where: {
        id: participantId,
      }
    })

    if (!participant) {
      throw new Error('Participant not found.')
    }

    if (participant.is_confirmed) {
      return replay.redirect(`http://localhost:3000/trips/${participant.trip_id}`)
    }

    await prisma.participant.update({
      where: { id: participantId },
      data: { is_confirmed: true }
    })

    return replay.redirect(`http://locahost:3000/trips/${participant.trip_id}`)
  })
}