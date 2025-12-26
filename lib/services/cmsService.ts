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

export const updateGlassMaster = async (id: string, data: Partial<GlassMaster>) =>
    prisma.glassMaster.update({
        where: { id },
        data
    });

export const deleteGlassMaster = async (id: string) =>
    prisma.glassMaster.delete({
        where: { id }
    });

export const createAluminumMaster = async (data: Omit<AluminumMaster, "id">) =>
    prisma.aluminumMaster.create({
        data: {
            buildType: data.buildType,
            pricePerSqFt: data.pricePerSqFt,
            constants: data.constants as Prisma.InputJsonValue
        }
    });

export const updateAluminumMaster = async (id: string, data: Partial<AluminumMaster>) =>
    prisma.aluminumMaster.update({
        where: { id },
        data: {
            ...data,
            constants: data.constants as Prisma.InputJsonValue
        }
    });

export const deleteAluminumMaster = async (id: string) =>
    prisma.aluminumMaster.delete({
        where: { id }
    });
