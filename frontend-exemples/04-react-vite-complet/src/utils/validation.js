/**
 * Schémas de validation avec Zod
 */

import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, 'Le nom d\'utilisateur est requis'),
    password: z.string().min(1, 'Le mot de passe est requis')
});

export const registerSchema = z.object({
    username: z.string().min(3, 'Minimum 3 caractères'),
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Minimum 6 caractères'),
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis')
});

export const employeeSchema = z.object({
    firstName: z.string().min(2, 'Minimum 2 caractères').max(50, 'Maximum 50 caractères'),
    lastName: z.string().min(2, 'Minimum 2 caractères').max(50, 'Maximum 50 caractères'),
    birthDate: z.string().refine(date => {
        const age = new Date().getFullYear() - new Date(date).getFullYear();
        return age >= 16 && age <= 100;
    }, 'L\'employé doit avoir entre 16 et 100 ans'),
    gender: z.enum(['Homme', 'Femme', 'Autre'], { 
        errorMap: () => ({ message: 'Sélectionner un genre' }) 
    }),
    titleId: z.string().uuid('Sélectionner un titre')
});

export const titleSchema = z.object({
    description: z.string()
        .min(1, 'La description est requise')
        .max(100, 'Maximum 100 caractères')
});

