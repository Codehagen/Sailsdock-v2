'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  Phone,
  Mail,
  Building,
  Calendar,
  Clock,
  Briefcase,
  Target,
  Users,
  MessageSquare,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { nb } from 'date-fns/locale'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Check, X, Trash2, Loader2 } from 'lucide-react'
import { updatePerson } from '@/actions/people/update-person'
import { toast } from 'sonner'
import {
  PersonData,
  CompanyData,
  OpportunityData,
} from '@/lib/internal-api/types'
import { CompanyCombobox } from '@/components/people/company-combobox'
import { OpportunityCombobox } from '@/components/people/opportunity-combobox'
import { updateOpportunity } from '@/actions/opportunity/update-opportunities'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { useSidebarStore } from '@/stores/use-sidebar-store'
import SMS from '../sms-dialog'
import { getCurrentUser } from '@/actions/user/get-user-data'

interface InfoItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
  isLink?: boolean
  isBadge?: boolean
  linkPrefix?: string
  displayValue?: string
  editable?: boolean
}

export function PersonUserDetails({
  personDetails,
}: {
  personDetails: PersonData
}) {
  const [editedName, setEditedName] = useState(personDetails.name)
  const [editedTitle, setEditedTitle] = useState(personDetails.title || '')
  const [editedPhone, setEditedPhone] = useState(personDetails.phone || '')
  const [editedEmail, setEditedEmail] = useState(personDetails.email || '')

  const [isNamePopoverOpen, setIsNamePopoverOpen] = useState(false)
  const [isTitlePopoverOpen, setIsTitlePopoverOpen] = useState(false)
  const [isPhonePopoverOpen, setIsPhonePopoverOpen] = useState(false)
  const [isEmailPopoverOpen, setIsEmailPopoverOpen] = useState(false)

  // New state for company, opportunities, and other people
  const [companies, setCompanies] = useState<
    {
      id: number
      uuid: string
      name: string
      orgnr: string
    }[]
  >(personDetails.companies || [])
  const [opportunities, setOpportunities] = useState<OpportunityData[]>(
    personDetails.opportunities || []
  )
  const [otherPeople, setOtherPeople] = useState<PersonData[]>([]) // You might need to fetch this data

  const { sidebarData } = useSidebarStore()

  // Check if this person is in favorites
  const favoriteView = sidebarData?.['1']?.find(
    (view) => view.url === `/people/${personDetails.uuid}`
  )

  const handleUpdateField = async (field: string, value: string) => {
    try {
      const updateData = { [field]: value }

      const updatedPerson = await updatePerson(personDetails.uuid, updateData)

      if (updatedPerson) {
        let successMessage = ''
        switch (field) {
          case 'name':
            successMessage = 'Navn er oppdatert'
            break
          case 'title':
            successMessage = 'Tittel er oppdatert'
            break
          case 'email':
            successMessage = 'E-postadresse er oppdatert'
            break
          case 'phone':
            successMessage = 'Telefonnummer er oppdatert'
            break
          default:
            successMessage = `${field} er oppdatert`
        }
        toast.success(successMessage)
        return true
      } else {
        let errorMessage = ''
        switch (field) {
          case 'name':
            errorMessage = 'Kunne ikke oppdatere navn'
            break
          case 'title':
            errorMessage = 'Kunne ikke oppdatere tittel'
            break
          case 'email':
            errorMessage = 'Kunne ikke oppdatere e-postadresse'
            break
          case 'phone':
            errorMessage = 'Kunne ikke oppdatere telefonnummer'
            break
          default:
            errorMessage = `Kunne ikke oppdatere ${field}`
        }
        toast.error(errorMessage)
        return false
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
      let errorMessage = ''
      switch (field) {
        case 'name':
          errorMessage = 'En feil oppstod under oppdatering av navn'
          break
        case 'title':
          errorMessage = 'En feil oppstod under oppdatering av tittel'
          break
        case 'email':
          errorMessage = 'En feil oppstod under oppdatering av e-postadresse'
          break
        case 'phone':
          errorMessage = 'En feil oppstod under oppdatering av telefonnummer'
          break
        default:
          errorMessage = `En feil oppstod under oppdatering av ${field}`
      }
      toast.error(errorMessage)
      return false
    }
  }

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, 'd. MMMM yyyy', { locale: nb })
  }

  const getTimeAgo = (dateString: string) => {
    const date = parseISO(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: nb })
  }

  const addedTimeAgo = getTimeAgo(personDetails.date_created)

  const infoItems: InfoItem[] = [
    {
      icon: User,
      label: 'Navn',
      value: editedName,
      editable: true,
    },
    {
      icon: Building,
      label: 'Tittel',
      value: editedTitle,
      editable: true,
    },
    {
      icon: Mail,
      label: 'E-post',
      value: editedEmail,
      editable: true,
    },
    {
      icon: Phone,
      label: 'Telefon',
      value: editedPhone,
      editable: true,
    },
    {
      icon: Calendar,
      label: 'Opprettet',
      value: formatDate(personDetails.date_created),
      displayValue: getTimeAgo(personDetails.date_created),
    },
    {
      icon: Clock,
      label: 'Sist endret',
      value: personDetails.last_modified,
      displayValue: getTimeAgo(personDetails.last_modified),
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center flex-wrap">
        <CardTitle className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="/path-to-person-avatar.png"
              alt={personDetails.name}
            />
            <AvatarFallback>
              {personDetails.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold truncate">{editedName}</h3>
            </div>
            <span className="block text-xs text-muted-foreground mt-1">
              Lagt til {addedTimeAgo}
            </span>
          </div>
        </CardTitle>
        <SMS customer={personDetails} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
                {item.label}:
              </span>
              {item.editable ? (
                <Popover
                  open={
                    item.label === 'Navn'
                      ? isNamePopoverOpen
                      : item.label === 'Tittel'
                      ? isTitlePopoverOpen
                      : item.label === 'Telefon'
                      ? isPhonePopoverOpen
                      : isEmailPopoverOpen
                  }
                  onOpenChange={
                    item.label === 'Navn'
                      ? setIsNamePopoverOpen
                      : item.label === 'Tittel'
                      ? setIsTitlePopoverOpen
                      : item.label === 'Telefon'
                      ? setIsPhonePopoverOpen
                      : setIsEmailPopoverOpen
                  }>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-normal text-left">
                      <span className="text-sm text-muted-foreground">
                        {item.value || 'Ikke angitt'}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <Input
                        value={
                          item.label === 'Navn'
                            ? editedName
                            : item.label === 'Tittel'
                            ? editedTitle
                            : item.label === 'Telefon'
                            ? editedPhone
                            : editedEmail
                        }
                        onChange={(e) =>
                          item.label === 'Navn'
                            ? setEditedName(e.target.value)
                            : item.label === 'Tittel'
                            ? setEditedTitle(e.target.value)
                            : item.label === 'Telefon'
                            ? setEditedPhone(e.target.value)
                            : setEditedEmail(e.target.value)
                        }
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (item.label === 'Navn')
                              setEditedName(personDetails.name)
                            else if (item.label === 'Tittel')
                              setEditedTitle(personDetails.title || '')
                            else if (item.label === 'Telefon')
                              setEditedPhone(personDetails.phone || '')
                            else setEditedEmail(personDetails.email || '')

                            if (item.label === 'Navn')
                              setIsNamePopoverOpen(false)
                            else if (item.label === 'Tittel')
                              setIsTitlePopoverOpen(false)
                            else if (item.label === 'Telefon')
                              setIsPhonePopoverOpen(false)
                            else setIsEmailPopoverOpen(false)
                          }}>
                          <X className="h-4 w-4 mr-1" />
                          Avbryt
                        </Button>
                        <Button
                          size="sm"
                          onClick={async () => {
                            const field =
                              item.label === 'Navn'
                                ? 'name'
                                : item.label === 'Tittel'
                                ? 'title'
                                : item.label === 'Telefon'
                                ? 'phone'
                                : 'email'
                            const value =
                              item.label === 'Navn'
                                ? editedName
                                : item.label === 'Tittel'
                                ? editedTitle
                                : item.label === 'Telefon'
                                ? editedPhone
                                : editedEmail
                            const success = await handleUpdateField(
                              field,
                              value
                            )
                            if (success) {
                              if (item.label === 'Navn')
                                setIsNamePopoverOpen(false)
                              else if (item.label === 'Tittel')
                                setIsTitlePopoverOpen(false)
                              else if (item.label === 'Telefon')
                                setIsPhonePopoverOpen(false)
                              else setIsEmailPopoverOpen(false)
                            }
                          }}>
                          <Check className="h-4 w-4 mr-1" />
                          Bekreft
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {item.displayValue || item.value}
                </span>
              )}
            </div>
          ))}

          <Separator className="my-4" />

          {/* Company Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Bedrifter ({companies.length})
              </h4>
              <CompanyCombobox
                personId={personDetails.uuid}
                onCompanyAdded={(newCompany) => {
                  setCompanies((prev) => [...prev, newCompany])
                  toast.success(`${newCompany.name} lagt til som selskap`)
                }}
                currentCompanies={companies.map((comp) => comp.id)}
              />
            </div>
            {companies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {companies.map((company) => (
                  <div key={company.uuid} className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 bg-secondary rounded-full py-1 pl-2 pr-1 hover:bg-secondary/80 transition-colors">
                      <Link
                        href={`/company/${company.uuid}`}
                        className="flex items-center gap-2 flex-grow">
                        <div
                          className={cn(
                            'flex items-center justify-center',
                            'w-6 h-6 rounded-full bg-orange-100 text-orange-500',
                            'text-xs font-medium'
                          )}>
                          {company.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {company.name}
                        </span>
                      </Link>
                      <Separator orientation="vertical" className="h-4 mx-1" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-transparent -ml-2">
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              try {
                                const updatedCompanyIds = companies
                                  .filter((c) => c.id !== company.id)
                                  .map((c) => c.id)

                                const updatedPerson = await updatePerson(
                                  personDetails.uuid,
                                  {
                                    companies: updatedCompanyIds,
                                  }
                                )

                                if (updatedPerson) {
                                  setCompanies(
                                    companies.filter((c) => c.id !== company.id)
                                  )
                                  toast.success('Selskapstilknytning fjernet')
                                } else {
                                  throw new Error('Failed to remove company')
                                }
                              } catch (error) {
                                console.error('Error removing company:', error)
                                toast.error(
                                  'En feil oppstod under fjerning av selskap'
                                )
                              }
                            }}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Fjern
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                Ingen tilknyttede selskap
              </span>
            )}
          </div>

          <Separator className="my-4" />

          {/* Opportunities Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Muligheter ({opportunities.length})
              </h4>
              <OpportunityCombobox
                personId={personDetails.id}
                onOpportunityAdded={(newOpportunity) => {
                  setOpportunities((prev) => [...prev, newOpportunity])
                  toast.success(`${newOpportunity.name} lagt til som mulighet`)
                }}
                currentOpportunities={opportunities.map((opp) => opp.id)}
              />
            </div>
            {opportunities.map((opportunity) => (
              <div key={opportunity.uuid} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-secondary rounded-full py-1 pl-2 pr-1 hover:bg-secondary/80 transition-colors">
                  <Link
                    href={`/opportunity/${opportunity.uuid}`}
                    className="flex items-center gap-2 flex-grow">
                    <div
                      className={cn(
                        'flex items-center justify-center',
                        'w-6 h-6 rounded-full bg-orange-100 text-orange-500',
                        'text-xs font-medium'
                      )}>
                      {opportunity.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {opportunity.name}
                    </span>
                  </Link>
                  <Separator orientation="vertical" className="h-4 mx-1" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-transparent -ml-2">
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          try {
                            const updatedOpportunity = await updateOpportunity(
                              opportunity.uuid,
                              {
                                companies: opportunity.companies || [],
                              }
                            )
                            if (updatedOpportunity) {
                              setOpportunities(
                                opportunities.filter(
                                  (opp) => opp.id !== opportunity.id
                                )
                              )
                              toast.success(
                                `${opportunity.name} fjernet fra muligheter`
                              )
                            } else {
                              throw new Error('Failed to remove opportunity')
                            }
                          } catch (error) {
                            console.error('Error removing opportunity:', error)
                            toast.error(
                              'En feil oppstod under fjerning av mulighet'
                            )
                          }
                        }}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Fjern
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))}
          </div>

          {/* <Separator className="my-4" /> */}

          {/* Other People Section */}
          {/* <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Personer ({otherPeople.length})
              </h4>
            </div>
            {otherPeople.map((person) => (
              <Link
                key={person.uuid}
                href={`/people/${person.uuid}`}
                className="inline-block"
              >
                <div className="inline-flex items-center gap-2 bg-secondary rounded-full py-1 px-2 hover:bg-secondary/80 transition-colors">
                  <div
                    className={cn(
                      "flex items-center justify-center",
                      "w-6 h-6 rounded-full bg-orange-100 text-orange-500",
                      "text-xs font-medium"
                    )}
                  >
                    {person.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {person.name}
                  </span>
                </div>
              </Link>
            ))}
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
