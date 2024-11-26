import { z } from "zod"

const prospectTableSchema = z.object({
  id: z.string(),
  name: z.string(),
  geo_municipalty: z.string(),
  adm_founded_date: z.string(),
  adm_incorporation: z.string(),
  orgnr: z.string().optional(),
  adm_board: z.object({
    name: z.string(),
  }),
  adm_manager: z.string(),
  geo_street: z.string(),
  geo_zip: z.string(),
  geo_city: z.string(),
})

export type prospectTableSchema = z.infer<typeof prospectTableSchema>

const prospectSchema = z.object({
  id: z.string(),
  orgnr: z.string(),
  name: z.string(),
  adm_incorporation: z.string(),
  adm_manager: z.string(),
  date_created: z.string(),
  last_modified: z.string(),
  adm_founded_date: z.string(),
  adm_ceo: z.string(),
  adm_board: z.object({
    name: z.string(),
  }),
  adm_board_vara: z.object({
    name: z.string(),
  }),
  adm_num_employees: z.number(),
  class_nace_cat: z.string(),
  class_nace_sector: z.number(),
  class_nace_main: z.number(),
  class_nace_group: z.number(),
  class_nace_sub: z.number(),
  class_sector: z.string(),
  class_industry: z.string(),
  geo_municipalty: z.string(),
  geo_county: z.string(),
  geo_street: z.string(),
  geo_zip: z.string(),
  geo_city: z.string(),
})

export type prospectSchema = z.infer<typeof prospectSchema>
