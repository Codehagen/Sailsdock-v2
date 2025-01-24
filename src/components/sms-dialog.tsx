'use client'

import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendSMS } from '@/actions/sms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import useMediaQuery from '@/lib/hooks/use-media-query'
/* import {
    getCurrentUserCompany,
    patchCompany
} from "@/app/api/citadel/companies/util"
import { createContactNote } from "@/app/api/citadel/notes/util"
import { CRM_User } from "@/app/api/citadel/users/types"
import { patchCurrentUser } from "@/app/api/citadel/users/util"
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { getClerkUser } from '@/actions/user/get-clerk-user'
import { getCurrentUser } from '@/actions/user/get-user-data'
import { updateCompany } from '@/actions/company/update-companies'
import { getCompanies } from '@/actions/company/get-companies'
import { getCompanyDetails } from '@/actions/company/get-details-companies'
import { updateUserData } from '@/actions/user/update-user-data'
import { User } from '@/types/user'
import { createNotesCompany } from '@/actions/company/create-notes-companies'

const FormSchema = z.object({
  sms: z
    .string()
    .max(1071, { message: 'SMS kan ikke inneholde mer enn 1071 tegn' }),
})
const PhoneSchema = z.object({
  phone: z.string().min(8, { message: 'Nummer må inneholde minst 8 siffer.' }),
})

export default function SMS({
  customer,
  disabled,
}: {
  customer: any
  disabled?: boolean
}) {
  const [user, setUser] = useState<any>(undefined)

  useEffect(() => {
    async function getUs() {
      setUser(await getCurrentUser())
    }
    getUs()
  }, [])

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isDesktop = useMediaQuery()

  if (!user)
    return (
      <Button disabled className="flex w-fit min-w-[122px] max-md:flex-1 px-3">
        <Loader2 className="animate-spin mr-1 h-4 w-4" />
        Send SMS
      </Button>
    )

  if (!user.phone)
    return <PhoneDialog userId={user.clerk_id} openDialog={setOpen} />

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            disabled={disabled}
            className="flex w-fit min-w-[122px] flex-1 px-3">
            <MessageSquare className="mr-1 h-4 w-4" />
            Send SMS
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>SMS</DrawerTitle>
            <DrawerDescription>
              <span className="flex gap-4">
                <>
                  <span className="font-semibold">Frasender:</span>{' '}
                  {user.phone ? user.phone : ''}
                </>{' '}
                <>
                  <span className="font-semibold">Mottaker:</span>{' '}
                  {customer?.phone ? customer?.phone : ''}
                </>
              </span>
              <span className="pt-2">
                Bruk malen eller skriv inn beskjed og trykk send
              </span>
            </DrawerDescription>
          </DrawerHeader>
          <SMSForm
            closeDialog={setOpen}
            loading={setLoading}
            customer={customer}
            user={user}
            footer={
              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <Button variant="outline">Lukk</Button>
                </DrawerClose>
                <Button
                  disabled={!user.phone || loading || !user.is_subscribed}
                  type="submit">
                  {loading ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    'Send'
                  )}
                </Button>
              </DrawerFooter>
            }
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="flex w-fit min-w-[122px] px-3">
          <MessageSquare className="mr-1 h-4 w-4" />
          Send SMS
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SMS</DialogTitle>
          <DialogDescription>
            <span className="flex gap-4">
              <>
                <span className="font-semibold">Frasender:</span>{' '}
                {user.phone ? user.phone : ''}
              </>{' '}
              <>
                <span className="font-semibold">Mottaker:</span>{' '}
                {customer?.phone ? customer?.phone : ''}
              </>
            </span>
            <span className="pt-2">
              Bruk malen eller skriv inn beskjed og trykk send
            </span>
          </DialogDescription>
        </DialogHeader>
        <SMSForm
          closeDialog={setOpen}
          loading={setLoading}
          customer={customer}
          user={user}
          footer={
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant="outline">Lukk</Button>
              </DialogTrigger>
              <Button
                disabled={!user.phone || loading || !user.is_subscribed}
                type="submit">
                {loading ? <Loader2 className="animate-spin size-4" /> : 'Send'}
              </Button>
            </DialogFooter>
          }
        />
      </DialogContent>
    </Dialog>
  )
}

//Reusable sms-form for the new drawer dialog.
function SMSForm({
  footer,
  customer,
  user,
  loading,
  closeDialog,
}: {
  footer: React.ReactNode
  customer: any
  user: any
  loading: Function
  closeDialog: Function
}) {
  console.log(customer)
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sms: `Hei,${
        customer?.name
          ? ' ' + customer?.name
          : ''
      }. Du mottar denne SMS-en for din tilknytning til ${customer?.companies?.[0]?.name ? customer?.companies?.[0]?.name : "<BEDRIFT>"}.

Jeg har prøvd å komme i kontakt med deg, fint om du kan ringe meg tilbake når anledningen passer.

Mvh
${user.first_name + ' ' + user.last_name}${user.title ? '\n' + user.title : ''}
${user.company_details.name}
        `,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    var sms_content = data.sms
    loading(true)
    const response: any = await sendSMS(
      customer?.phone ? customer?.phone : '',
      data.sms,
      user?.phone ? user.phone : '',
      false // true = testing, no sms is sent /// false = testing off, functionality is live.
    )

    //Check for errors from SMS provider before countinuing
    if (response.errors) {
      toast.error('Feilmelding:', {
        description: (
          <>
            <p>Tlf: {response.errors[0].number}</p>
            <p>{response.errors[0].message}</p>
          </>
        ),
      })
    } else if (response.fatalError) {
      //If sms has no recipient
      toast.error('Feilmelding:', {
        description: (
          <>
            <p>{response.fatalError}</p>
          </>
        ),
      })
    } else {
      //Check if the sms character length exceeds the backends 1500 limit and cuts the note if it does - Note will not be created if it exceeds the limit.
      if (data.sms.length > 1500) {
        sms_content = data.sms.substring(0, 1500)
        toast.success('Melding sendt til mottaker', {
          description: 'Notat inneholder mer enn 1500 tegn, notat avkortet.',
        })
      } else {
        toast.success('Melding sendt til mottaker', {
          description: 'Notat opprettet',
        })
      }

      //If no errors create a new contact note
      const noteData = {
        title: 'SMS',
        description: sms_content,
        type: 'sms',
        user: user.id,
        customer: customer?.id,
      }

      //Create contact note for SMS
      try {
        await createNotesCompany(noteData)
        console.log(response)
      } catch (e) {
        console.error('Error creating contact note for SMS: ', e)
      }

      //Update current users company sms count - Big BuxXx
      /*    try {
        const user = await getCurrentUser()
        const company = await getCompanyDetails(user?.company.toString() as any)
        if (company) {
          const newCount = company.sms_count + response.stdSMSCount //stdSMSCount is the number of SMS the provider uses to send the whole message
          await updateCompany(company.id, { sms_count: newCount })
        }
      } catch (e) {
        console.error('Error updating company sms_count: ', e)
      } */

      //Tell the parent component to stop loading and close the dialog before refreshing
      closeDialog(false)
      router.refresh()
    }

    //Remove loading spinner if errors
    loading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-sm:px-1">
        <FormField
          control={form.control}
          name="sms"
          render={({ field }) => (
            <FormItem className="pb-2">
              <FormControl>
                <Textarea spellCheck={false} rows={9} {...field} />
              </FormControl>
              <FormDescription>
                Lengde: {form.getValues('sms').length} / Maks: 1071
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {footer}
      </form>
    </Form>
  )
}

function PhoneDialog({
  openDialog,
  userId,
}: {
  openDialog: Function
  userId: any
}) {
  const [state, setState] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof PhoneSchema>>({
    resolver: zodResolver(PhoneSchema),
  })

  function runToast(title: string, message: string) {
    toast(title, {
      description: message,
    })
  }

  async function onSubmit(data: z.infer<typeof PhoneSchema>) {
    setLoading(true)
    try {
      const response = await updateUserData({ clerk_id: userId, ...data })
      if (response?.uuid) {
        runToast('Nummer oppdatert!', 'Du kan nå bruke SMS-funksjonen')
        openDialog(true)
      } else {
        runToast(
          'Her skjedde det en feil',
          'Ta kontakt med support eller prøv igjen senere'
        )
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
    setState(false)
    router.refresh()
  }

  return (
    <Dialog open={state} onOpenChange={setState}>
      <DialogTrigger asChild>
        <Button className="flex w-fit min-w-[122px] flex-1 px-3">
          <MessageSquare className="mr-1 h-4 w-4" />
          Send SMS
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OBS!</DialogTitle>
          <DialogDescription>
            Før du kan bruke SMS-funksjonen må du legge til et telefonnummer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-1">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobilnummer:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Ved å legge til telefonnummeret ditt, bekrefter du at det er
                    ditt eget nummer, og du aksepterer all ansvar knyttet til
                    bruken av tjenesten.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogTrigger asChild>
                <Button variant="outline">Lukk</Button>
              </DialogTrigger>
              <Button disabled={loading} type="submit">
                {loading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  'Lagre'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
