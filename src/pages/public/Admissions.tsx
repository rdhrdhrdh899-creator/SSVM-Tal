import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, User, Book, Users, MapPin, Search, Plane, Clock, ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { PageLayout } from '../../components/public/PageLayout';
import { useAdmissionStore } from '../../store/admissionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { SCHOOL_NAME } from '../../constants';

const admissionSchema = z.object({
  // Step 1: Student
  studentName: z.string().min(3, 'Name is too short'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select gender'),
  nationality: z.string().min(1, 'Nationality is required'),
  // Step 2: Academic
  applyingClass: z.string().min(1, 'Select a class'),
  previousSchool: z.string().min(1, 'Previous school name is required'),
  previousMarks: z.string().min(1, 'Percentage is required'),
  // Step 3: Parents
  fatherName: z.string().min(3, 'Father name is required'),
  motherName: z.string().min(3, 'Mother name is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number (10 digits)'),
  email: z.string().email('Invalid email address'),
  // Step 4: Address
  address: z.string().min(10, 'Complete address is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Invalid pincode (6 digits)'),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

export const Admissions = () => {
  const { settings } = useSettingsStore();
  const currentSchoolName = settings?.schoolName || SCHOOL_NAME;
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitApplication = useAdmissionStore((state) => state.submitApplication);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    mode: 'onBlur',
  });

  const nextStep = async () => {
    const fields: any = {
      1: ['studentName', 'dob', 'gender', 'nationality'],
      2: ['applyingClass', 'previousSchool', 'previousMarks'],
      3: ['fatherName', 'motherName', 'phone', 'email'],
      4: ['address', 'pincode'],
    };
    
    const isValid = await trigger(fields[step]);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: AdmissionFormData) => {
    setIsSubmitting(true);
    try {
      await submitApplication(data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: User, label: 'Student' },
    { icon: Book, label: 'Academic' },
    { icon: Users, label: 'Parents' },
    { icon: MapPin, label: 'Address' },
    { icon: Search, label: 'Review' },
  ];

  if (isSubmitted) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <h1 className="heading-serif text-4xl font-bold text-navy-900 mb-4">Application Submitted!</h1>
          <p className="text-lg text-gray-600 max-w-lg mb-8">
            Thank you for applying to {currentSchoolName}. Your application ID is <span className="font-bold text-navy-900">AV-{Math.floor(Math.random() * 89999 + 10000)}</span>. 
            We have sent a confirmation email with further instructions.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/'}>Return Home</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-navy-950 py-20 mb-[-100px] relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="heading-serif text-4xl md:text-6xl font-bold text-white mb-6">Online Admissions</h1>
          <p className="text-xl text-cream-50/70 max-w-2xl mx-auto">Start your journey with us. Fill in the details below to begin the application process for the Academic Session 2024-25.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-12 bg-white p-6 rounded-3xl shadow-xl">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative last:flex-none">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${i + 1 <= step ? 'bg-navy-800 border-navy-800 text-white' : 'bg-white border-gray-200 text-gray-400'}`}
                >
                  <s.icon size={18} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter mt-2 ${i + 1 <= step ? 'text-navy-900' : 'text-gray-400'}`}>{s.label}</span>
                {i < steps.length - 1 && (
                  <div className={`absolute top-5 left-[50%] right-[-50%] h-[2px] transition-colors duration-300 ${i + 1 < step ? 'bg-navy-800' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <Card className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="heading-serif text-2xl font-bold text-navy-900 border-l-4 border-gold-400 pl-4">Student Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input label="Student Full Name" placeholder="As per Birth Certificate" {...register('studentName')} error={errors.studentName?.message} />
                      <Input label="Date of Birth" type="date" {...register('dob')} error={errors.dob?.message} />
                      <div>
                        <label className="text-sm font-medium text-navy-900 ml-1">Gender</label>
                        <select 
                          className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm mt-1.5"
                          {...register('gender')}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-xs text-red-500 ml-1 mt-1">{errors.gender.message}</p>}
                      </div>
                      <Input label="Nationality" placeholder="e.g. Indian" {...register('nationality')} error={errors.nationality?.message} />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="heading-serif text-2xl font-bold text-navy-900 border-l-4 border-gold-400 pl-4">Academic Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-navy-900 ml-1">Applying for Class</label>
                        <select 
                          className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm mt-1.5"
                          {...register('applyingClass')}
                        >
                          <option value="">Select Class</option>
                          {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                        </select>
                        {errors.applyingClass && <p className="text-xs text-red-500 ml-1 mt-1">{errors.applyingClass.message}</p>}
                      </div>
                      <Input label="Last School Attended" placeholder="School Name & City" {...register('previousSchool')} error={errors.previousSchool?.message} />
                      <Input label="Total Percentage in Last Class" placeholder="e.g. 92%" {...register('previousMarks')} error={errors.previousMarks?.message} />
                      <div className="md:col-span-2 p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-500">Upload Birth Certificate / Last Year Report Card (PDF/JPG)</p>
                        <Button size="sm" variant="outline" className="mt-4 bg-white">Choose File</Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="heading-serif text-2xl font-bold text-navy-900 border-l-4 border-gold-400 pl-4">Parent/Guardian Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input label="Father's Full Name" {...register('fatherName')} error={errors.fatherName?.message} />
                      <Input label="Mother's Full Name" {...register('motherName')} error={errors.motherName?.message} />
                      <Input label="Primary Phone Number" placeholder="10 digit number" {...register('phone')} error={errors.phone?.message} />
                      <Input label="Official Email ID" placeholder="example@email.com" {...register('email')} error={errors.email?.message} />
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                   >
                    <h2 className="heading-serif text-2xl font-bold text-navy-900 border-l-4 border-gold-400 pl-4">Contact Address</h2>
                    <div className="grid gap-6">
                      <Input label="Residential Address" placeholder="Street, Locality, City, State" {...register('address')} error={errors.address?.message} />
                      <div className="w-full md:w-1/2">
                        <Input label="Pincode" placeholder="6 digit code" {...register('pincode')} error={errors.pincode?.message} />
                      </div>
                    </div>
                    <div className="p-4 bg-navy-50 rounded-xl text-xs text-navy-700 flex items-start">
                      <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                      By proceeding, I confirm that all information provided is accurate and I agree to the school's online admission terms and conditions.
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="heading-serif text-2xl font-bold text-navy-900 border-l-4 border-gold-400 pl-4">Review Your Application</h2>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Student</p>
                        <p className="font-bold text-navy-900">{getValues('studentName')}</p>
                        <p className="text-sm text-gray-600">Class: {getValues('applyingClass')} | {getValues('gender')}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Parent</p>
                        <p className="font-bold text-navy-900">F: {getValues('fatherName')}</p>
                        <p className="font-bold text-navy-900">M: {getValues('motherName')}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Contact</p>
                        <p className="text-sm font-bold text-navy-900">{getValues('phone')} | {getValues('email')}</p>
                        <p className="text-sm text-gray-600">{getValues('address')}, {getValues('pincode')}</p>
                      </div>
                    </div>
                    <div className="text-center p-4">
                        <p className="text-sm text-gray-500 mb-4 italic">Double check all fields before final submission.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between pt-6 border-t border-gray-100">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex items-center">
                    <ArrowLeft className="mr-2" size={18} /> Previous
                  </Button>
                ) : <div />}
                
                {step < 5 ? (
                  <Button type="button" variant="primary" onClick={nextStep} className="flex items-center">
                    Next <ArrowRight className="ml-2" size={18} />
                  </Button>
                ) : (
                  <Button type="submit" variant="emerald" size="lg" className="px-12">
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};
