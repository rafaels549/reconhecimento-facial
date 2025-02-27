import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { Link } from '@inertiajs/react';

export default function Dashboard({ auth, successMessage, funcionarios }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Funcionários</h2>}
        >
            <Head title="Funcionários" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                     

                        {funcionarios && funcionarios.length > 0 ? (
                            <div>
                                {funcionarios.map(funcionario => (
                                    <div key={funcionario.id} className="p-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">{funcionario.name}</p>
                                                <p>Cargo: {funcionario.cargo}</p>
                                            
                                                <p>Data de admissão: {funcionario.formatted_created_at}</p>
                                                <Link
                                                    href={route('funcionario.editar', { id: funcionario.id })}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                  Editar
                                                </Link>
                                            </div>
                                            <div>
                                                <img src={`https://reconhecimento-facial-production.up.railway.app/storage/${funcionario.imagem}`} alt="" className="w-20 h-20 rounded-full" />
                                                
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-gray-600">Nenhum funcionário encontrado.</div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
