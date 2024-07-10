import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getOneParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId', {
    schema: {
      params: z.object({
        participantId: z.string().uuid(),
      }),
    }
  }, async (request) => {
    const { participantId } = request.params

    const participant = await prisma.participant.findUnique({
      // No select abaixo eu estou escolhendo apenas os dados que eu quero retornar, e seto o valor desses dados como "true".
      select: {
        id: true,
        name: true,
        email: true,
        is_confirmed: true,
      },
      where: { id: participantId },
    })

    if (!participant) {
      throw new Error("Participant not found.")
    }

    return { participant }
  })
}