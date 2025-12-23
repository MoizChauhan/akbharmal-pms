import { prisma } from "@/lib/prisma";
import { GlassMaster, AluminumMaster, Prisma } from "@prisma/client";

export const getGlassMasters = async () => prisma.glassMaster.findMany();
export const getAluminumMasters = async () => prisma.aluminumMaster.findMany();

export const createGlassMaster = async (data: Omit<GlassMaster, "id">) =>
    prisma.glassMaster.create({
        data: {
            type: data.type,
            color: data.color,
            mmRange: data.mmRange,
            pricePerSqFt: data.pricePerSqFt
        }
    });

export const createAluminumMaster = async (data: Omit<AluminumMaster, "id">) =>
    prisma.aluminumMaster.create({
        data: {
            buildType: data.buildType,
            constants: data.constants as Prisma.InputJsonValue
        }
    });
