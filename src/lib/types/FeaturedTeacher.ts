export interface FeaturedTeacherProps {
  title?: string;
  description?: string;
  dataTestid?: string;
  memberName: string;
  memberRole: string;
  memberBio: string;
  memberImage?: string;
  memberXLink?: string;
  memberLinkedinLink?: string;
}

export interface SelectedMember {
  name: string;
  role: string;
  bio: string;
}

export interface ModalProps {
  title: string;
  message: string;
  buttonText: string;
  open: boolean;
  onClose: () => void;
} 