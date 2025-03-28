const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const atividade = await prisma.atividade.create({
            data: req.body
        });
        return res.status(201).json(atividade);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const atividades = await prisma.atividade.findMany();
    return res.json(atividades);
}

const readOne = async (req, res) => {
    try {
        const atividade = await prisma.atividade.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.json(atividade);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const atividade = await prisma.atividade.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(atividade);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.atividade.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

const calcularParcial = async (req, res) => {
    try {
        const atividade = await prisma.atividade.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if (!atividade) {
            return res.status(404).json({ error: 'Atividade não encontrada' });
        }

       
        const parcial = atividade.nota !== null && atividade.peso !== null
            ? atividade.nota * atividade.peso
            : null;

        const atividadeAtualizada = await prisma.atividade.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                parcial
            }
        });

        return res.json({
            parcialCalculado: parcial,
            atividade: atividadeAtualizada
        });
    } catch (error) {
        return res.status(400).json({ 
            error: 'Erro ao calcular parcial',
            details: error.message 
        });
    }
}

module.exports = { create, read, readOne, update, remove, calcularParcial };