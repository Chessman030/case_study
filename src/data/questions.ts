export interface Question {
  id: number
  type: 'text'
  text: string
  answer: string
  marks: number
}

export const questions: Question[] = [
  {
    id: 1,
    type: 'text',
    text: 'A developer leaves a secret note in the HTML comments of the login page. What security issue is this?',
    answer: 'information disclosure',
    marks: 10,
  },
  {
    id: 2,
    type: 'text',
    text: 'The application trusts a role value stored only in the browser and never verifies it on the server. What vulnerability class is this?',
    answer: 'broken access control',
    marks: 10,
  },
]

export const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0)