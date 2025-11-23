import { Component } from '@angular/core';
import * as AOS from 'aos';

interface FAQItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}


@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  faqItems: FAQItem[] = [
    {
      question: 'What are your business hours?',
      answer: 'We\'re available Monday to Friday from 9:00 AM to 6:00 PM EST, and Saturday from 10:00 AM to 4:00 PM EST. We\'re closed on Sundays. Email inquiries are answered within 24 hours.',
      isOpen: false
    },
    {
      question: 'How quickly will I receive a response?',
      answer: 'We respond to all inquiries within 24 hours during business days. For urgent matters, please call us during business hours for immediate assistance.',
      isOpen: false
    },
    {
      question: 'Do you offer wholesale or corporate partnerships?',
      answer: 'Yes! We welcome wholesale inquiries and corporate partnerships. Please select "Wholesale/Corporate" in the subject line of our contact form, and our team will reach out with more information.',
      isOpen: false
    },
    {
      question: 'Can I visit your location?',
      answer: 'Our corporate headquarters is located in Toronto, ON. We welcome visits by appointment. Please contact us in advance to schedule your visit.',
      isOpen: false
    },
    {
      question: 'How can I track my order?',
      answer: 'For order-related questions, please select "Order Question" in the contact form, and include your order number. Our customer support team will assist you with tracking information.',
      isOpen: false
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently we ship within Canada. We\'re working on expanding our international shipping capabilities. Contact us for updates on international availability.',
      isOpen: false
    }
  ];

  // Contact Form Model
  contactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  ngOnInit(): void {
    // Initialize AOS animations
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      disable: false,
    });

    // Scroll to top on component load
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    // Refresh AOS after view init
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }

  // Toggle FAQ item
  toggleFAQ(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  // Handle form submission
  onSubmit(): void {
    if (this.isFormValid()) {
      console.log('Form submitted:', this.contactForm);
      
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
      
      // Reset form
      this.resetForm();
    }
  }

  // Check if form is valid
  isFormValid(): boolean {
    return !!(
      this.contactForm.name &&
      this.contactForm.email &&
      this.contactForm.subject &&
      this.contactForm.message
    );
  }

  // Reset form to initial state
  resetForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}
