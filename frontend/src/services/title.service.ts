import { get, post, put, del } from '@/lib/api-client';
import { TitleRequest, TitleResponse } from '@/types';

/**
 * Service de gestion des titres/postes
 */
export const titleService = {
  /**
   * Récupérer tous les titres
   */
  async getAll(): Promise<TitleResponse[]> {
    return await get<TitleResponse[]>('/titles');
  },

  /**
   * Récupérer un titre par ID
   */
  async getById(id: string): Promise<TitleResponse> {
    return await get<TitleResponse>(`/titles/${id}`);
  },

  /**
   * Créer un nouveau titre (Admin seulement)
   */
  async create(data: TitleRequest): Promise<TitleResponse> {
    return await post<TitleResponse>('/titles', data);
  },

  /**
   * Mettre à jour un titre (Manager/Admin)
   */
  async update(id: string, data: TitleRequest): Promise<TitleResponse> {
    return await put<TitleResponse>(`/titles/${id}`, data);
  },

  /**
   * Supprimer un titre (Admin seulement)
   */
  async delete(id: string): Promise<void> {
    await del(`/titles/${id}`);
  },

  /**
   * Récupérer les titres par département
   */
  async getByDepartment(department: string): Promise<TitleResponse[]> {
    const allTitles = await this.getAll();
    return allTitles.filter(title => 
      title.department.toLowerCase() === department.toLowerCase()
    );
  },

  /**
   * Rechercher des titres
   */
  async search(query: string): Promise<TitleResponse[]> {
    const allTitles = await this.getAll();
    
    if (!query) return allTitles;
    
    const searchTerm = query.toLowerCase();
    return allTitles.filter(title => 
      title.name.toLowerCase().includes(searchTerm) ||
      title.description.toLowerCase().includes(searchTerm) ||
      title.department.toLowerCase().includes(searchTerm)
    );
  },

  /**
   * Obtenir la liste des départements
   */
  async getDepartments(): Promise<string[]> {
    const titles = await this.getAll();
    const departments = new Set(titles.map(title => title.department));
    return Array.from(departments).sort();
  },
};

