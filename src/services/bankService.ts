import { supabase } from '../lib/supabase';
import { Bank, PolicyText } from '../types/database';

export class BankService {
  static async getAllBanks(): Promise<Bank[]> {
    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async createBank(name: string): Promise<Bank> {
    const { data, error } = await supabase
      .from('banks')
      .insert({ name })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateBank(id: number, name: string): Promise<Bank> {
    const { data, error } = await supabase
      .from('banks')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteBank(id: number): Promise<void> {
    const { error } = await supabase
      .from('banks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async getPolicyByBankId(bankId: number): Promise<PolicyText | null> {
    const { data, error } = await supabase
      .from('policies_text')
      .select('*')
      .eq('bank_id', bankId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async createOrUpdatePolicy(
    bankId: number, 
    policyText: string, 
    embedding: number[]
  ): Promise<PolicyText> {
    const existingPolicy = await this.getPolicyByBankId(bankId);
    
    if (existingPolicy) {
      const { data, error } = await supabase
        .from('policies_text')
        .update({ 
          policy_text: policyText, 
          embedding,
          updated_at: new Date().toISOString()
        })
        .eq('bank_id', bankId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('policies_text')
        .insert({ 
          bank_id: bankId, 
          policy_text: policyText, 
          embedding 
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  static async searchSimilarPolicies(query: string): Promise<PolicyText[]> {
    // This would require a vector similarity search
    // For now, returning all policies for demonstration
    const { data, error } = await supabase
      .from('policies_text')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }
}