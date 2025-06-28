import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Crown, Edit3, MessageCircle, Share2, Bell, Check, X } from 'lucide-react';

const FamilyCollaboration = ({ onCollaborationChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [collaborators, setCollaborators] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [newInviteEmail, setNewInviteEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('contributor');

    // Load collaboration data from localStorage
    useEffect(() => {
        const savedCollaborators = localStorage.getItem('biography_collaborators');
        const savedContributions = localStorage.getItem('biography_contributions');
        const savedInvitations = localStorage.getItem('biography_invitations');

        if (savedCollaborators) {
            setCollaborators(JSON.parse(savedCollaborators));
        }
        if (savedContributions) {
            setContributions(JSON.parse(savedContributions));
        }
        if (savedInvitations) {
            setInvitations(JSON.parse(savedInvitations));
        }
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('biography_collaborators', JSON.stringify(collaborators));
        localStorage.setItem('biography_contributions', JSON.stringify(contributions));
        localStorage.setItem('biography_invitations', JSON.stringify(invitations));
        if (onCollaborationChange) onCollaborationChange({ collaborators, contributions, invitations });
    }, [collaborators, contributions, invitations, onCollaborationChange]);

    const roles = {
        owner: { name: 'Owner', icon: Crown, color: 'text-yellow-600', bg: 'bg-yellow-100', permissions: ['edit', 'invite', 'manage'] },
        editor: { name: 'Editor', icon: Edit3, color: 'text-blue-600', bg: 'bg-blue-100', permissions: ['edit', 'comment'] },
        contributor: { name: 'Contributor', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-100', permissions: ['comment', 'suggest'] },
        viewer: { name: 'Viewer', icon: Users, color: 'text-gray-600', bg: 'bg-gray-100', permissions: ['view'] }
    };

    const sendInvitation = () => {
        if (!newInviteEmail.trim()) return;

        const invitation = {
            id: Date.now(),
            email: newInviteEmail,
            role: selectedRole,
            sentAt: new Date().toISOString(),
            status: 'pending'
        };

        setInvitations([...invitations, invitation]);
        setNewInviteEmail('');

        // Simulate email sending
        setTimeout(() => {
            console.log(`Invitation sent to ${newInviteEmail} as ${selectedRole}`);
        }, 1000);
    };

    const acceptInvitation = (invitationId) => {
        const invitation = invitations.find(inv => inv.id === invitationId);
        if (!invitation) return;

        const newCollaborator = {
            id: Date.now(),
            email: invitation.email,
            name: invitation.email.split('@')[0], // Use email prefix as name
            role: invitation.role,
            joinedAt: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${invitation.email.split('@')[0]}&background=random`
        };

        setCollaborators([...collaborators, newCollaborator]);
        setInvitations(invitations.filter(inv => inv.id !== invitationId));
    };

    const removeCollaborator = (collaboratorId) => {
        setCollaborators(collaborators.filter(c => c.id !== collaboratorId));
    };

    const changeRole = (collaboratorId, newRole) => {
        setCollaborators(collaborators.map(c =>
            c.id === collaboratorId ? {...c, role: newRole } : c
        ));
    };

    const addContribution = (type, content, section) => {
        const contribution = {
            id: Date.now(),
            type, // 'edit', 'comment', 'suggestion'
            content,
            section,
            author: 'Current User', // In real app, this would be the logged-in user
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        setContributions([contribution, ...contributions]);
    };

    const approveContribution = (contributionId) => {
        setContributions(contributions.map(c =>
            c.id === contributionId ? {...c, status: 'approved' } : c
        ));
    };

    const rejectContribution = (contributionId) => {
        setContributions(contributions.map(c =>
            c.id === contributionId ? {...c, status: 'rejected' } : c
        ));
    };

    if (!isOpen) {
        return ( <
                button onClick = {
                    () => setIsOpen(true)
                }
                className = "flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" >
                <
                Users className = "w-4 h-4" / >
                <
                span className = "text-sm font-medium" > Family Collaboration < /span> {
                collaborators.length > 0 && ( <
                    span className = "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs" > { collaborators.length } <
                    /span>
                )
            } <
            /button>
    );
}

return ( <
    div className = "bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-6 shadow-lg max-w-4xl" >
    <
    div className = "flex items-center justify-between mb-6" >
    <
    div className = "flex items-center gap-2" >
    <
    Users className = "w-5 h-5 text-blue-600 dark:text-blue-400" / >
    <
    h3 className = "font-semibold text-blue-900 dark:text-blue-100" > Family Collaboration < /h3> < /
    div > <
    button onClick = {
        () => setIsOpen(false)
    }
    className = "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" > ×
    <
    /button> < /
    div >

    <
    div className = "grid grid-cols-1 lg:grid-cols-2 gap-6" > { /* Invite New Collaborator */ } <
    div className = "space-y-4" >
    <
    h4 className = "font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2" >
    <
    UserPlus className = "w-4 h-4" / >
    Invite Family Member <
    /h4>

    <
    div className = "space-y-3" >
    <
    input type = "email"
    placeholder = "Enter email address"
    value = { newInviteEmail }
    onChange = {
        (e) => setNewInviteEmail(e.target.value)
    }
    className = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" /
    >

    <
    select value = { selectedRole }
    onChange = {
        (e) => setSelectedRole(e.target.value)
    }
    className = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" > {
        Object.entries(roles).map(([roleKey, role]) => ( <
            option key = { roleKey }
            value = { roleKey } > { role.name } < /option>
        ))
    } <
    /select>

    <
    button onClick = { sendInvitation }
    disabled = {!newInviteEmail.trim() }
    className = "w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" >
    Send Invitation <
    /button> < /
    div >

    { /* Role Descriptions */ } <
    div className = "bg-gray-50 dark:bg-gray-700 rounded-lg p-3" >
    <
    h5 className = "font-medium text-gray-900 dark:text-gray-100 mb-2" > Role Permissions: < /h5> <
    div className = "space-y-1 text-sm" > {
        Object.entries(roles).map(([roleKey, role]) => ( <
            div key = { roleKey }
            className = "flex items-center gap-2" >
            <
            role.icon className = { `w-3 h-3 ${role.color}` }
            /> <
            span className = "font-medium" > { role.name }: < /span> <
            span className = "text-gray-600 dark:text-gray-400" > { role.permissions.join(', ') } <
            /span> < /
            div >
        ))
    } <
    /div> < /
    div > <
    /div>

    { /* Current Collaborators */ } <
    div className = "space-y-4" >
    <
    h4 className = "font-medium text-gray-900 dark:text-gray-100" >
    Current Collaborators({ collaborators.length }) <
    /h4>

    <
    div className = "space-y-2 max-h-64 overflow-y-auto" > {
        collaborators.map((collaborator) => {
                const role = roles[collaborator.role];
                return ( <
                        div key = { collaborator.id }
                        className = "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                        <
                        img src = { collaborator.avatar }
                        alt = { collaborator.name }
                        className = "w-8 h-8 rounded-full" /
                        >
                        <
                        div className = "flex-1" >
                        <
                        div className = "font-medium text-gray-900 dark:text-gray-100" > { collaborator.name } <
                        /div> <
                        div className = "text-sm text-gray-600 dark:text-gray-400" > { collaborator.email } <
                        /div> < /
                        div > <
                        div className = { `flex items-center gap-1 px-2 py-1 rounded text-xs ${role.bg} ${role.color}` } >
                        <
                        role.icon className = "w-3 h-3" / > { role.name } <
                        /div> {
                        collaborator.role !== 'owner' && ( <
                            button onClick = {
                                () => removeCollaborator(collaborator.id)
                            }
                            className = "text-red-500 hover:text-red-700 p-1"
                            title = "Remove collaborator" >
                            <
                            X className = "w-4 h-4" / >
                            <
                            /button>
                        )
                    } <
                    /div>
            );
        })
}

{
    collaborators.length === 0 && ( <
        p className = "text-gray-500 dark:text-gray-400 text-center py-4" >
        No collaborators yet.Invite family members to contribute!
        <
        /p>
    )
} <
/div> < /
div > <
    /div>

{ /* Pending Invitations */ } {
    invitations.length > 0 && ( <
        div className = "mt-6 pt-6 border-t border-gray-200 dark:border-gray-600" >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100 mb-3" >
        Pending Invitations({ invitations.length }) <
        /h4> <
        div className = "space-y-2" > {
            invitations.map((invitation) => ( <
                div key = { invitation.id }
                className = "flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg" >
                <
                div >
                <
                span className = "font-medium text-gray-900 dark:text-gray-100" > { invitation.email } <
                /span> <
                span className = "ml-2 text-sm text-gray-600 dark:text-gray-400" >
                as { roles[invitation.role].name } <
                /span> < /
                div > <
                div className = "flex items-center gap-2" >
                <
                button onClick = {
                    () => acceptInvitation(invitation.id)
                }
                className = "px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700" >
                <
                Check className = "w-4 h-4" / >
                <
                /button> <
                button onClick = {
                    () => setInvitations(invitations.filter(inv => inv.id !== invitation.id))
                }
                className = "px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700" >
                <
                X className = "w-4 h-4" / >
                <
                /button> < /
                div > <
                /div>
            ))
        } <
        /div> < /
        div >
    )
}

{ /* Recent Contributions */ } {
    contributions.length > 0 && ( <
        div className = "mt-6 pt-6 border-t border-gray-200 dark:border-gray-600" >
        <
        h4 className = "font-medium text-gray-900 dark:text-gray-100 mb-3" >
        Recent Contributions({ contributions.length }) <
        /h4> <
        div className = "space-y-2 max-h-48 overflow-y-auto" > {
            contributions.slice(0, 5).map((contribution) => ( <
                div key = { contribution.id }
                className = "flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                <
                div className = "flex-1" >
                <
                div className = "flex items-center gap-2 mb-1" >
                <
                span className = "font-medium text-gray-900 dark:text-gray-100" > { contribution.author } <
                /span> <
                span className = { `px-2 py-1 rounded text-xs ${
                      contribution.type === 'edit' ? 'bg-blue-100 text-blue-800' :
                      contribution.type === 'comment' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }` } > { contribution.type } <
                /span> <
                span className = "text-xs text-gray-500" > { new Date(contribution.createdAt).toLocaleDateString() } <
                /span> < /
                div > <
                p className = "text-sm text-gray-600 dark:text-gray-400 mb-1" > { contribution.content } <
                /p> <
                p className = "text-xs text-gray-500" >
                Section: { contribution.section } <
                /p> < /
                div > {
                    contribution.status === 'pending' && ( <
                        div className = "flex gap-1" >
                        <
                        button onClick = {
                            () => approveContribution(contribution.id)
                        }
                        className = "p-1 text-green-600 hover:text-green-800"
                        title = "Approve" >
                        <
                        Check className = "w-4 h-4" / >
                        <
                        /button> <
                        button onClick = {
                            () => rejectContribution(contribution.id)
                        }
                        className = "p-1 text-red-600 hover:text-red-800"
                        title = "Reject" >
                        <
                        X className = "w-4 h-4" / >
                        <
                        /button> < /
                        div >
                    )
                } <
                /div>
            ))
        } <
        /div> < /
        div >
    )
}

{ /* Quick Actions */ } <
div className = "mt-6 pt-6 border-t border-gray-200 dark:border-gray-600" >
    <
    div className = "flex flex-wrap gap-2" >
    <
    button onClick = {
        () => addContribution('suggestion', 'Consider adding more details about childhood memories', 'Early Years')
    }
className = "px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-800" >
    Add Sample Suggestion <
    /button> <
button onClick = {
    () => addContribution('comment', 'This section is beautifully written!', 'About Me')
}
className = "px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-800" >
    Add Sample Comment <
    /button> <
button className = "px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800" >
    <
    Share2 className = "w-4 h-4 inline mr-1" / >
    Share Biography Link <
    /button> < /
div > <
    /div> < /
div >
);
};

export default FamilyCollaboration;