import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check } from "lucide-react"

interface InterviewSchedulerProps {
  applicantName: string
  applicant: any
  onSchedule: (dateTime: { date: Date; time: string; applicant: any }) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InterviewScheduler({ applicantName, applicant, onSchedule, open, onOpenChange }: InterviewSchedulerProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("")

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00"
  ]

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const normalizedDate = new Date(Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      ));
      setDate(normalizedDate);
    }
  }

  const handleSchedule = () => {
    if (date && time) {
      onSchedule({ date, time, applicant })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Schedule Interview with {applicantName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date: any) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              className="rounded-md border shadow"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Time</label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSchedule}
            disabled={!date || !time}
            className="w-full sm:w-auto"
          >
            <Check className="mr-2 h-4 w-4" />
            Confirm Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
